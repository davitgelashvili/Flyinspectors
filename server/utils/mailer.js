const nodemailer = require("nodemailer");
const MailSettings = require("../jsonModels/mailSettingsModal");
const { encrypt, decrypt, canEncrypt } = require("./secret");

// ბაზას ყოველ წერილზე არ ვეკითხებით — პაროლი წუთით იკეშება.
// კეში პროცესის მეხსიერებაშია და resetCache() მხოლოდ იმ პროცესს უშლის,
// რომელმაც შენახვა დაამუშავა. Passenger აპს რამდენიმე worker-ად უშვებს,
// ანუ სხვა worker-ს ძველი პაროლი შეიძლება შერჩეს — ამას sendMail() ხსნის:
// ავთენტიფიკაციის შეცდომაზე კეშს იყრის და ბაზიდან ახალს იღებს.
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

function createTransport(pass) {
    return nodemailer.createTransport({
        host: SMTP.host,
        port: SMTP.port,
        secure: SMTP.secure,
        auth: { user: SMTP.user, pass },
    });
}

// Gmail არასწორ პაროლს EAUTH-ით (SMTP 535) აბრუნებს. ქსელის ან მიმღების
// შეცდომას ამით არ ავურევთ — ხელახალი ცდა მხოლოდ პაროლის გულისთვისაა.
function isAuthError(error) {
    return Boolean(error) && (error.code === "EAUTH" || error.responseCode === 535);
}

/**
 * ყველა წერილი აქედან იგზავნება. თუ პანელიდან პაროლი შეიცვალა, მაგრამ ამ
 * worker-ს ძველი კეშში შერჩა, ავთენტიფიკაცია ჩავარდება — კეშს ვიყრით,
 * ბაზიდან ახალს ვიღებთ და ერთხელ ხელახლა ვცდით. ანუ პაროლის ცვლილება
 * კლიენტის ფორმაზე მაშინვე აისახება და Node-ის restart აღარ სჭირდება.
 */
async function sendMail(mailOptions) {
    const stale = await getMailPassword();

    try {
        return await createTransport(stale).sendMail(mailOptions);
    } catch (error) {
        if (!isAuthError(error)) throw error;

        resetCache();
        const fresh = await getMailPassword();

        // პაროლი თუ არ შეცვლილა, მეორე ცდა იმავე შეცდომით დასრულდებოდა
        if (fresh === stale) throw error;

        console.warn("⚠️ მეილის პაროლი მოძველებული იყო — ბაზიდან განახლდა და ხელახლა ვცდი");
        return await createTransport(fresh).sendMail(mailOptions);
    }
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
    // ადმინის შემოწმება ყოველთვის ბაზის ახალ მნიშვნელობაზე უნდა გადიოდეს,
    // თორემ ამ worker-ის კეში „წარმატებას" აჩვენებდა ძველი პაროლით
    resetCache();
    const pass = await getMailPassword();

    const transporter = createTransport(pass);

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
    sendMail,
    savePassword,
    readStatus,
    verifyPassword,
    resetCache,
};
