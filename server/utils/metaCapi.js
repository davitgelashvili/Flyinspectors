// Meta Conversions API (CAPI): მომხმარებლის მოქმედებას სერვერიდან ვუგზავნით Meta-ს.
// ბრაუზერის პიქსელი ad-blocker-ით, cookie-ს შეზღუდვით ან iOS-ზე იკარგება — სერვერული მოვლენა კი მიდის.
// Access Token საიდუმლოა: მხოლოდ server/.env-შია და ბრაუზერში არასოდეს ხვდება.
const crypto = require("crypto");

// Meta-ს მოთხოვნის ვერსია. .env-ით გადაფარვადია, რომ ვერსიის აწევას კოდის ცვლილება არ სჭირდებოდეს.
const DEFAULT_API_VERSION = "v19.0";
const TIMEOUT_MS = 5000;

// Meta პერსონალურ მონაცემებს მხოლოდ ჰეშირებულად იღებს: SHA-256, წინასწარ trim + lowercase
const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");

const hashText = (value) => {
    const text = String(value ?? "").trim().toLowerCase();
    return text ? sha256(text) : undefined;
};

// ტელეფონი მხოლოდ ციფრებით — '+', ჰარეები და დეფისები იშლება
const hashPhone = (value) => {
    const digits = String(value ?? "").replace(/\D/g, "");
    return digits ? sha256(digits) : undefined;
};

// cPanel-ის proxy-ს უკან req.ip proxy-ს მისამართია; მომხმარებლის ნამდვილი IP პირველია x-forwarded-for-ში
const clientIp = (req) => {
    const forwarded = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
    return forwarded || req.socket?.remoteAddress || undefined;
};

// ცარიელ ველს არ ვაგზავნით — Meta-ს "match quality"-ს აფუჭებს
const compact = (obj) => Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== ""));

// Events Manager → Data sources → Settings. META_PIXEL_ID და META_DATASET_ID ერთი და იგივე
// ნომერია; ორივე სახელს ვკითხულობთ, რომ ძველი .env-ებიც იმუშაოს.
const config = () => ({
    pixelId: process.env.META_PIXEL_ID || process.env.META_DATASET_ID,
    accessToken: process.env.META_CAPI_ACCESS_TOKEN,
    apiVersion: process.env.META_API_VERSION || DEFAULT_API_VERSION,
    // Events Manager → Test Events-ის კოდი; პროდაქშენზე ცარიელი/დაკომენტარებული უნდა იყოს
    testEventCode: process.env.META_TEST_EVENT_CODE,
});

/**
 * მომხმარებლის ამომცნობი ველები. IP, User Agent და პიქსელის cookie-ები (fbp/fbc) ყოველთვის
 * მიჰყვება — ამათზე აკავშირებს Meta სერვერულ მოვლენას რეკლამის ნახვასთან.
 * დანარჩენი (em/ph/fn/ln/ct/external_id) მხოლოდ მაშინ, როცა გვაქვს.
 */
const userData = (req, user = {}) =>
    compact({
        em: hashText(user.email),
        ph: hashPhone(user.phone),
        fn: hashText(user.firstName),
        ln: hashText(user.lastName),
        ct: hashText(user.city),
        external_id: hashText(user.externalId),
        // fbp/fbc — პიქსელის cookie-ები; ბექი ვერ კითხულობს, ფრონტი მოთხოვნაში გვიგზავნის
        fbp: user.fbp,
        fbc: user.fbc,
        client_ip_address: clientIp(req),
        client_user_agent: req.headers["user-agent"],
    });

/**
 * ერთი ან რამდენიმე მოვლენა ერთი მოთხოვნით. არასოდეს throw-ავს: მარკეტინგის მოვლენამ
 * მომხმარებლის მოთხოვნა არ უნდა ჩააგდოს. შედეგს აბრუნებს, რომ გამომძახებელს ლოგის საშუალება ჰქონდეს.
 *
 * eventId — იმავე ID-ით ბრაუზერის პიქსელიც აგზავნის ამ მოვლენას, ასე Meta დუბლს აერთიანებს
 * და ერთ კონვერსიას ორჯერ არ ითვლის (flyinspectors/src/utils/metaPixel.js ფრონტზე).
 */
async function sendEvents(req, events) {
    const { pixelId, accessToken, apiVersion, testEventCode } = config();
    if (!pixelId || !accessToken) {
        return { ok: false, skipped: "META_PIXEL_ID / META_CAPI_ACCESS_TOKEN არ არის server/.env-ში" };
    }

    const list = (Array.isArray(events) ? events : [events]).filter(Boolean);
    if (!list.length) return { ok: false, skipped: "მოვლენების სია ცარიელია" };

    const eventTime = Math.floor(Date.now() / 1000);
    const payload = compact({
        data: list.map(({ eventName, eventId, eventSourceUrl, user }) =>
            compact({
                event_name: eventName,
                event_time: eventTime,
                action_source: "website",
                event_id: eventId,
                event_source_url: eventSourceUrl,
                user_data: userData(req, user),
            })
        ),
        test_event_code: testEventCode,
    });

    const names = list.map((e) => e.eventName).join(", ");

    try {
        // ტოკენი Authorization ჰედერშია და არა URL-ში, რომ proxy-ს ლოგებში არ ჩაიწეროს
        const res = await fetch(`https://graph.facebook.com/${apiVersion}/${pixelId}/events`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(TIMEOUT_MS),
        });

        const text = await res.text();
        if (!res.ok) {
            console.error(`❌ Meta CAPI "${names}": ${res.status} ${text}`);
            return { ok: false, error: text };
        }
        return { ok: true, response: text };
    } catch (error) {
        console.error(`❌ Meta CAPI "${names}":`, error.message);
        return { ok: false, error: error.message };
    }
}

const sendEvent = (req, event) => sendEvents(req, [event]);

module.exports = { sendEvent, sendEvents };
