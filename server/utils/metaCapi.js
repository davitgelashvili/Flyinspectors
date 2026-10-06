// Meta Conversions API (CAPI): მომხმარებლის მოქმედებას სერვერიდან ვუგზავნით Meta-ს.
// ბრაუზერის პიქსელი ad-blocker-ით, cookie-ს შეზღუდვით ან iOS-ზე იკარგება — სერვერული მოვლენა კი მიდის.
// Access Token საიდუმლოა: მხოლოდ server/.env-შია და ბრაუზერში არასოდეს ხვდება.
const crypto = require("crypto");

const API_VERSION = "v21.0";
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

/**
 * ერთი მოვლენა Meta-ს. არასოდეს throw-ავს: მარკეტინგის მოვლენამ მომხმარებლის მოთხოვნა
 * არ უნდა ჩააგდოს. შედეგს აბრუნებს, რომ გამომძახებელს ლოგის საშუალება ჰქონდეს.
 *
 * eventId — იმავე ID-ით ბრაუზერის პიქსელიც აგზავნის ამ მოვლენას, ასე Meta დუბლს აერთიანებს
 * და ერთ კონვერსიას ორჯერ არ ითვლის (src/utils/metaPixel.js ფრონტზე).
 */
async function sendEvent(req, { eventName, eventId, eventSourceUrl, user = {} }) {
    const datasetId = process.env.META_DATASET_ID;
    const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
    if (!datasetId || !accessToken) {
        return { ok: false, skipped: "META_DATASET_ID / META_CAPI_ACCESS_TOKEN არ არის server/.env-ში" };
    }

    const payload = compact({
        data: [
            {
                event_name: eventName,
                event_time: Math.floor(Date.now() / 1000),
                action_source: "website",
                ...compact({ event_id: eventId, event_source_url: eventSourceUrl }),
                user_data: compact({
                    em: hashText(user.email),
                    ph: hashPhone(user.phone),
                    fn: hashText(user.firstName),
                    ln: hashText(user.lastName),
                    ct: hashText(user.city),
                    external_id: hashText(user.externalId),
                    // fbp/fbc — პიქსელის cookie-ები, ფრონტი განაცხადთან ერთად გვიგზავნის
                    fbp: user.fbp,
                    fbc: user.fbc,
                    client_ip_address: clientIp(req),
                    client_user_agent: req.headers["user-agent"],
                }),
            },
        ],
        access_token: accessToken,
        // Events Manager → Test Events-ის კოდი; პროდაქშენზე ცარიელი უნდა იყოს
        test_event_code: process.env.META_TEST_EVENT_CODE,
    });

    try {
        // ტოკენი body-შია და არა URL-ში, რომ ლოგებში არ ჩაიწეროს
        const res = await fetch(`https://graph.facebook.com/${API_VERSION}/${datasetId}/events`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(TIMEOUT_MS),
        });

        const text = await res.text();
        if (!res.ok) {
            console.error(`❌ Meta CAPI "${eventName}": ${res.status} ${text}`);
            return { ok: false, error: text };
        }
        return { ok: true, response: text };
    } catch (error) {
        console.error(`❌ Meta CAPI "${eventName}":`, error.message);
        return { ok: false, error: error.message };
    }
}

module.exports = { sendEvent };
