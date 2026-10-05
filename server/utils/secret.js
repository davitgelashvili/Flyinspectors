const crypto = require("crypto");

const ALGO = "aes-256-gcm";
const VERSION = "v1";

// გასაღები მხოლოდ MAIL_SECRET-იდან მოდის. JWT_SECRET-ს განზრახ არ ვიყენებთ:
// სესიის გასაღების როტაცია მეილის პაროლს არ უნდა გააუვარგისოს.
function key() {
    const secret = process.env.MAIL_SECRET;
    if (!secret) return null;
    return crypto.createHash("sha256").update(String(secret)).digest();
}

/** MAIL_SECRET თუ არ არის, შიფრვა გამოტოვდება და პაროლი ღიად ჩაიწერება */
function canEncrypt() {
    return Boolean(key());
}

/** null → შიფრვა შეუძლებელია (გასაღები არ არის) */
function encrypt(plain) {
    const k = key();
    if (!k) return null;

    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGO, k, iv);
    const data = Buffer.concat([cipher.update(String(plain), "utf8"), cipher.final()]);

    return [
        VERSION,
        iv.toString("base64"),
        cipher.getAuthTag().toString("base64"),
        data.toString("base64"),
    ].join(":");
}

/** null → გაშიფვრა ვერ მოხერხდა (არასწორი გასაღები ან დაზიანებული ჩანაწერი) */
function decrypt(payload) {
    const k = key();
    if (!k || typeof payload !== "string") return null;

    const [version, iv, tag, data] = payload.split(":");
    if (version !== VERSION || !iv || !tag || !data) return null;

    try {
        const decipher = crypto.createDecipheriv(ALGO, k, Buffer.from(iv, "base64"));
        decipher.setAuthTag(Buffer.from(tag, "base64"));
        return Buffer.concat([
            decipher.update(Buffer.from(data, "base64")),
            decipher.final(),
        ]).toString("utf8");
    } catch {
        return null;
    }
}

module.exports = { canEncrypt, encrypt, decrypt };
