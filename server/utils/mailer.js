const nodemailer = require("nodemailer");
const MailSettings = require("../jsonModels/mailSettingsModal");
const { encrypt, decrypt, canEncrypt } = require("./secret");

// ბაზას ყოველ წერილზე არ ვეკითხებით — პაროლი წუთით იკეშება.
// ადმინის მიერ შენახვისას კეში მაშინვე იყრება, ანუ ახალი პაროლი იმავე
// ინსტანციაზე მყისვე მოქმედებს, სხვა ინსტანციებზე — მაქსიმუმ წუთში.
const CACHE_MS = 60 * 1000;

// გამგზავნი ყუთი. პაროლი აქ არ წერია — ის მხოლოდ ბაზაშია და პანელიდან იცვლება.
const SMTP = {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    user: "info@flyinspectors.com",
};

let cache = null; // { pass, at }

/** null → ბაზაში გამოსადეგი პაროლი არ არის */
async function loadFromDb() {
    // pass/passEncrypted სქემაში select:false-ია, ცალკე უნდა მოვითხოვოთ
    const doc = await MailSettings.findOne({ key: "smtp" }).select("+pass +passEncrypted");
    if (!doc || !doc.pass) return null;

    if (!doc.passEncrypted) return doc.pass;

    const plain = decrypt(doc.pass);
    if (plain === null) {
        // MAIL_SECRET შეიცვალა ან დაიკარგა — არასწორი პაროლით გაგზავნას აზრი არ აქვს
        console.error("❌ Mail password: შენახული პაროლი ვერ გაიშიფრა — შეამოწმე MAIL_SECRET");
        return null;
    }

    return plain;
}

/**
 * გაგზავნის ფუნქციების ერთადერთი შესვლის წერტილი. პაროლი მხოლოდ ბაზიდან
 * მოდის — .env-ს განზრახ არ ვეკითხებით, თორემ პანელში შეცვლილი პაროლი
 * env-ის ძველ მნიშვნელობას დაემთხვეოდა და ცვლილება არ იმოქმედებდა.
 */
async function getMailPassword() {
    if (cache && Date.now() - cache.at < CACHE_MS) return cache.pass;

    const pass = await loadFromDb();
    if (!pass) {
        throw new Error(
            "მეილის აპლიკაციის პაროლი ბაზაში არ არის — ადმინ პანელი → მეილის პაროლი"
        );
    }

    cache = { pass, at: Date.now() };
    return pass;
}

function resetCache() {
    cache = null;
}

async function savePassword(pass) {
    const value = String(pass);
    const encrypted = encrypt(value);

    const doc = await MailSettings.findOneAndUpdate(
        { key: "smtp" },
        {
            $set: {
                pass: encrypted || value,
                passEncrypted: Boolean(encrypted),
            },
        },
        { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    resetCache();

    return doc;
}

/** ადმინ პანელისთვის — პაროლს არ აბრუნებს, მხოლოდ მდგომარეობას */
async function readStatus() {
    const doc = await MailSettings.findOne({ key: "smtp" }).select("+pass +passEncrypted");

    return {
        user: SMTP.user,
        hasPassword: Boolean(doc && doc.pass),
        encrypted: Boolean(doc && doc.passEncrypted),
        source: doc && doc.pass ? "db" : "none",
        updatedAt: doc ? doc.updatedAt : null,
        encryptionAvailable: canEncrypt(),
    };
}

/**
 * ბაზის პაროლით SMTP-ზე მიერთებას ამოწმებს. `to` თუ მიეცემა, ტესტურ
 * წერილსაც აგზავნის — ადმინს ცოცხალ ფორმამდე დარწმუნების საშუალება აქვს.
 */
async function verifyPassword(to) {
    const pass = await getMailPassword();

    const transporter = nodemailer.createTransport({
        host: SMTP.host,
        port: SMTP.port,
        secure: SMTP.secure,
        auth: { user: SMTP.user, pass },
    });

    await transporter.verify();

    if (to) {
        await transporter.sendMail({
            from: `"Flyinspectors" <${SMTP.user}>`,
            to,
            subject: "Flyinspectors — SMTP ტესტი",
            text: "მეილის აპლიკაციის პაროლი მუშაობს.",
            html: "<p>მეილის აპლიკაციის პაროლი მუშაობს.</p>",
        });
    }
}

module.exports = {
    getMailPassword,
    savePassword,
    readStatus,
    verifyPassword,
    resetCache,
};
