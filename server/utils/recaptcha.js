// Google reCAPTCHA v3 — ქულაზე დაფუძნებული, უხილავი შემოწმება. ვიზიტორს
// არაფერზე დაწკაპუნება არ სჭირდება: ბრაუზერი ტოკენს აწარმოებს, ჩვენ კი
// Google-ს ვეკითხებით, რამდენად ჰგავს ის ადამიანს.
const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

// ქულა 0.0 (ბოტი) — 1.0 (ადამიანი). Google-ის რეკომენდებული ზღვარი 0.5-ია.
const DEFAULT_MIN_SCORE = 0.5;

// Google-ის პასუხს წუთზე მეტ ხანს არ ველოდებით — თორემ მათი შეფერხება
// ჩვენი ფორმასაც გაჰყინავდა.
const TIMEOUT_MS = 8000;

/**
 * გასაღები თუ გარემოში არ არის, შემოწმება გამოტოვდება. ეს განზრახია:
 * RECAPTCHA_SECRET_KEY-ის დამატებამდე ფორმები ისე მუშაობს, როგორც აქამდე.
 */
function isEnabled() {
    return Boolean(process.env.RECAPTCHA_SECRET_KEY);
}

function minScore() {
    const value = Number(process.env.RECAPTCHA_MIN_SCORE);
    return Number.isFinite(value) && value >= 0 && value <= 1 ? value : DEFAULT_MIN_SCORE;
}

/**
 * ტოკენის შემოწმება Google-თან.
 * @returns {Promise<{ok: boolean, reason?: string, score?: number}>}
 */
async function verifyToken(token, { action, ip } = {}) {
    if (!isEnabled()) return { ok: true, reason: "disabled" };
    if (!token) return { ok: false, reason: "token-missing" };

    const body = new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: String(token),
    });
    // remoteip არასავალდებულოა, მაგრამ Google-ს შეფასებაში ეხმარება
    if (ip) body.set("remoteip", ip);

    let data;
    try {
        const res = await fetch(VERIFY_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body,
            signal: AbortSignal.timeout(TIMEOUT_MS),
        });
        data = await res.json();
    } catch (error) {
        // Google-მდე ვერ მივედით — ფორმის დაბლოკვა აქ ნამდვილ მომხმარებელს
        // დააზარალებდა, ამიტომ ვლოგავთ და ვუშვებთ.
        console.error("⚠️ reCAPTCHA verify failed (network):", error.message);
        return { ok: true, reason: "verify-unreachable" };
    }

    if (!data || data.success !== true) {
        const codes = (data && data["error-codes"]) || [];
        return { ok: false, reason: codes.join(",") || "verify-failed" };
    }

    // action-ის შედარება იცავს ტოკენის სხვა ფორმიდან გადმოტანისგან
    if (action && data.action && data.action !== action) {
        return { ok: false, reason: `action-mismatch:${data.action}` };
    }

    const score = typeof data.score === "number" ? data.score : 0;
    if (score < minScore()) return { ok: false, reason: "low-score", score };

    return { ok: true, score };
}

module.exports = { isEnabled, minScore, verifyToken };
