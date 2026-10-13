/**
 * ბაზაში ღიად შენახული მეილის აპლიკაციის პაროლის დაშიფვრა — პაროლის
 * ხელახლა შეყვანის გარეშე: არსებულს თავად წაიკითხავს და იმავე ადგილას
 * დაშიფრულად გადააწერს.
 *
 * გაშვება (MAIL_SECRET უნდა იყოს გარემოში):
 *   MAIL_SECRET=<გასაღები> node scripts/encryptMailPassword.js
 *
 * ⚠️ რიგი მნიშვნელოვანია: MAIL_SECRET ჯერ სერვერზე უნდა იყოს დაყენებული.
 * დაშიფრულ პაროლს გასაღების გარეშე ვერავინ წაიკითხავს და წერილები შეწყდება.
 *
 * უსაფრთხოა მრავალჯერ გაშვება: უკვე დაშიფრულს ხელახლა არ ეხება.
 */
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const MailSettings = require("../jsonModels/mailSettingsModal");
const { savePassword, readStatus } = require("../utils/mailer");
const { canEncrypt, decrypt } = require("../utils/secret");

async function main() {
    if (!canEncrypt()) {
        console.error("❌ MAIL_SECRET გარემოში არ არის — გასაღების გარეშე შიფრვა შეუძლებელია.");
        console.error('   გაშვება: MAIL_SECRET=<გასაღები> node scripts/encryptMailPassword.js');
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URL);

    const doc = await MailSettings.findOne({ key: "smtp" }).select("+pass +passEncrypted");

    if (!doc || !doc.pass) {
        console.error("❌ ბაზაში პაროლი არ არის — ადმინ პანელიდან შეიყვანე.");
        await mongoose.disconnect();
        process.exit(1);
    }

    if (doc.passEncrypted) {
        // გასაღები თუ შეცვლილია, ჩანაწერი უკვე გამოუსადეგარია — ეს ხმამაღლა უნდა ითქვას
        if (decrypt(doc.pass) === null) {
            console.error("❌ პაროლი დაშიფრულია, მაგრამ ამ MAIL_SECRET-ით ვერ იშიფრება.");
            console.error("   ან გასაღები არ არის სწორი, ან პაროლი პანელიდან ხელახლა უნდა შეიყვანო.");
            await mongoose.disconnect();
            process.exit(1);
        }

        console.log("ℹ️ პაროლი უკვე დაშიფრულია და წარმატებით იშიფრება — ცვლილება არ დასჭირდა.");
        await mongoose.disconnect();
        return;
    }

    const plain = doc.pass;
    await savePassword(plain);

    // გადამოწმება: ჩანაწერი დაშიფრულია და უკან იგივე პაროლი მოდის
    const after = await MailSettings.findOne({ key: "smtp" }).select("+pass +passEncrypted");
    const roundTrip = after.passEncrypted ? decrypt(after.pass) : null;

    if (roundTrip !== plain) {
        console.error("❌ გადამოწმება ჩავარდა — ჩანაწერი არ დაიშიფრა ან უკან სხვა მნიშვნელობა მოდის.");
        await mongoose.disconnect();
        process.exit(1);
    }

    const status = await readStatus();
    console.log("✅ პაროლი დაშიფრულია (AES-256-GCM)");
    console.log(`   encrypted: ${status.encrypted}`);
    console.log(`   updatedAt: ${status.updatedAt}`);
    console.log("ℹ️ შეამოწმე SMTP: node scripts/seedMailPassword.js --test \"you@example.com\"");

    await mongoose.disconnect();
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
