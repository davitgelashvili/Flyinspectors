// Meta Conversions API-ის საჯარო endpoint: ბრაუზერი PageView-ს სერვერზე გადმოგზავნის,
// სერვერი კი Meta-ს უგზავნის IP-სა და User Agent-თან ერთად (ამათი წაკითხვა ბრაუზერს არ შეუძლია).
// პიქსელი იმავე მოვლენას იმავე event_id-ით აგზავნის — Meta დუბლს აერთიანებს.
const { sendEvent } = require("../utils/metaCapi");

const EVENT_NAME = "PageView";

// საჯარო და ავთენტიფიკაციის გარეშეა, ანუ სპამით Events Manager-ის სტატისტიკის გაფუჭება შეიძლება.
// თითო IP-ზე წუთში 60 მოვლენა ნებისმიერი ნამდვილი მომხმარებლისთვის (NAT-ის უკან ოფისიც) საკმარისია.
const WINDOW_MS = 60 * 1000;
const MAX_PER_WINDOW = 60;
const MAX_TRACKED_IPS = 5000;
const hits = new Map();

const ipOf = (req) => String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || req.socket?.remoteAddress || "unknown";

// Map მეხსიერებაში ცხოვრობს — ვადაგასულებს ვშლით, თორემ უნიკალური IP-ებით გაიზრდებოდა
const throttled = (ip) => {
    const now = Date.now();
    if (hits.size > MAX_TRACKED_IPS) {
        for (const [key, entry] of hits) if (now - entry.start > WINDOW_MS) hits.delete(key);
    }

    const entry = hits.get(ip);
    if (!entry || now - entry.start > WINDOW_MS) {
        hits.set(ip, { start: now, count: 1 });
        return false;
    }

    entry.count += 1;
    return entry.count > MAX_PER_WINDOW;
};

// ბრაუზერის გამოგზავნილს ვზღუდავთ: Meta-ს ველებს სიგრძის ლიმიტი აქვს და გრძელი
// ნაგავი მოთხოვნას ისედაც ჩააგდებდა
const text = (value, max) => {
    const str = String(value ?? "").trim();
    return str && str.length <= max ? str : undefined;
};

// მხოლოდ ნამდვილი http(s) მისამართი; ცუდის შემთხვევაში Referer-ზე ვცვივდებით
const pageUrl = (value, req) => {
    for (const candidate of [value, req.headers.referer]) {
        const str = text(candidate, 500);
        if (!str) continue;
        try {
            const url = new URL(str);
            if (url.protocol === "http:" || url.protocol === "https:") return url.href;
        } catch {
            /* შემდეგ ვარიანტზე */
        }
    }
    return undefined;
};

const pageView = async (req, res) => {
    try {
        if (throttled(ipOf(req))) return res.status(429).send("Too many events.");

        const { eventId, eventSourceUrl, fbp, fbc } = req.body || {};

        // event_id დედუპლიკაციის გასაღებია — უიმისოდ Meta ბრაუზერისა და სერვერის
        // მოვლენას ვერ გააერთიანებს და PageView ორჯერ ჩაითვლება
        const id = text(eventId, 100);
        if (!id) return res.status(400).send("eventId is required.");

        const result = await sendEvent(req, {
            eventName: EVENT_NAME,
            eventId: id,
            eventSourceUrl: pageUrl(eventSourceUrl, req),
            user: { fbp: text(fbp, 100), fbc: text(fbc, 300) },
        });

        // ფრონტი პასუხს არ ელოდება; სტატუსი მხოლოდ ხელით შემოწმებისთვისაა
        return res.status(result.ok ? 200 : 202).json({ sent: Boolean(result.ok) });
    } catch (error) {
        // მარკეტინგის მოვლენა არასოდეს უნდა გამოჩნდეს მომხმარებელთან შეცდომად
        console.error("❌ Meta CAPI pageView:", error);
        return res.status(202).json({ sent: false });
    }
};

module.exports = { pageView };
