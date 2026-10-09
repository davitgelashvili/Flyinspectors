/**
 * "წესები და პირობები" ცალკე გვერდად აღარ არსებობს — ქასთუმ გვერდად იქმნება
 * (ადმინი → გვერდის შექმნა). ეს სკრიპტი ძველ ტექსტს ბაზიდან ბეჭდავს, რომ
 * ახალ გვერდში გადასაკოპირებელი HTML ხელთ გქონდეს.
 *
 * მხოლოდ კითხულობს — არაფერს ცვლის და არაფერს შლის.
 *
 * გაშვება:
 *   node scripts/dumpTerms.js
 *
 * ტექსტის გადატანის შემდეგ ამ ფაილის წაშლა შეიძლება.
 */
const mongoose = require("mongoose");
require("dotenv").config();

async function main() {
    await mongoose.connect(process.env.MONGODB_URL);

    // მოდელი წაშლილია, ამიტომ კოლექციას პირდაპირ ვკითხულობთ
    const docs = await mongoose.connection.db.collection("terms").find({}).toArray();

    if (!docs.length) {
        console.log('terms კოლექცია ცარიელია — გადასატანი არაფერია.');
        await mongoose.disconnect();
        return;
    }

    for (const doc of docs) {
        for (const lang of ["ka", "en"]) {
            console.log(`\n${"=".repeat(70)}`);
            console.log(`${lang.toUpperCase()}  სათაური: ${doc.title?.[lang] || "(ცარიელი)"}`);
            console.log(`${"=".repeat(70)}\n`);
            console.log(doc.text?.[lang] || "(ტექსტი ცარიელია)");
        }
    }

    console.log(`\n${"-".repeat(70)}`);
    console.log("ზემოთ მოცემული HTML ჩასვი ახალ ქასთუმ გვერდში (ადმინი → გვერდის შექმნა).");
    console.log('slug იყოს "terms-and-conditions" — მისამართი არ შეიცვლება და ბმულები იმუშავებს.');

    await mongoose.disconnect();
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
