const { isEnabled, verifyToken } = require("../utils/recaptcha");

// ტოკენი ან body-ში მოდის (recaptchaToken), ან header-ით — header უპირატესია,
// რომ body ყოველთვის "სუფთა" დარჩეს.
const HEADER = "x-recaptcha-token";

function readToken(req) {
    const fromHeader = req.get ? req.get(HEADER) : null;
    if (fromHeader) return String(fromHeader);

    if (req.body && req.body.recaptchaToken) return String(req.body.recaptchaToken);
    return "";
}

/**
 * საჯარო ფორმების დაცვა. `action` ფრონტზე გადაცემულს უნდა ემთხვეოდეს
 * (იხ. flyinspectors/src/utils/recaptcha.js).
 *
 * RECAPTCHA_SECRET_KEY თუ გარემოში არ არის, middleware გამჭვირვალეა —
 * გასაღების დამატებამდე არაფერი იცვლება.
 */
function requireRecaptcha(action) {
    return async (req, res, next) => {
        // ტოკენი კონტროლერამდე არ უნდა მივიდეს: email-ის ტექსტში ან
        // mongoose-ის დოკუმენტში მას ადგილი არ აქვს.
        const token = readToken(req);
        if (req.body && "recaptchaToken" in req.body) delete req.body.recaptchaToken;

        if (!isEnabled()) return next();

        try {
            const ip = req.headers["x-forwarded-for"]
                ? String(req.headers["x-forwarded-for"]).split(",")[0].trim()
                : req.ip;

            const result = await verifyToken(token, { action, ip });

            if (!result.ok) {
                console.warn(`🛡️ reCAPTCHA blocked ${action}: ${result.reason}`, {
                    score: result.score,
                    ip,
                });
                return res.status(403).json({
                    message: "ვერიფიკაცია ვერ გაიარა — გადატვირთეთ გვერდი და სცადეთ ხელახლა",
                    code: "recaptcha_failed",
                });
            }

            req.recaptcha = result;
            return next();
        } catch (error) {
            // მოულოდნელმა შეცდომამ ფორმა არ უნდა გათიშოს
            console.error("❌ reCAPTCHA middleware error:", error);
            return next();
        }
    };
}

module.exports = { requireRecaptcha };
