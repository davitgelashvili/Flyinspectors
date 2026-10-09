/**
 * მეტა ტეგების ჩანაწერების ბაზაში გადატანა.
 *
 * გვერდი, რომლის მეტა ტეგებიც ადმინიდან უნდა იმართებოდეს, fly/src/i18n/metaPages.js-ის
 * META_PAGES-ში ემატება, ტექსტი კი ბაზაში უნდა იყოს — თორემ გვერდი სათაურსა და აღწერას
 * კარგავს, სანამ ადმინი ხელით არ შეავსებს. ეს სკრიპტი ძველ (კოდში ჩაწერილ) ტექსტს გადმოიტანს.
 *
 * უკვე არსებულ ჩანაწერს არ ეხება — ადმინში შესწორებული ტექსტი არ გადაიწერება.
 *
 * გაშვება:
 *   node scripts/seedMeta.js --list
 *   node scripts/seedMeta.js --apply
 */
const mongoose = require("mongoose");
require("dotenv").config();

const Meta = require("../jsonModels/metaModal");

// ტექსტი fly/src/i18n/pageMeta.js-ის PAGE_META-დან მოდის (იქიდან წაშლილია).
//   /submit-claim — ინდექსირდება, sitemap-შია
//   /check-status — noindex (პირადი განაცხადის ნაბიჯი); მეტა ტეგები ტაბსა და გაზიარებაზე მოქმედებს
const RECORDS = [
    {
        path: "/submit-claim",
        title: {
            en: "Submit a Claim — Flyinspectors",
            ka: "შეავსეთ განაცხადი — Flyinspectors",
        },
        description: {
            en: "Fill in the compensation claim form and our experts will handle the paperwork and present your complaint to the airline. Claims up to 6 years back.",
            ka: "შეავსეთ კომპენსაციის განაცხადი — დანარჩენს Flyinspectors გააკეთებს. განაცხადის შეტანა 6 წლის წინანდელ რეისზეც შეიძლება.",
        },
    },
    {
        path: "/check-status",
        title: {
            en: "Check Your Claim Status — Flyinspectors",
            ka: "შეამოწმეთ განაცხადის სტატუსი — Flyinspectors",
        },
        description: {
            en: "Enter the application number sent to your email to track the status of your flight compensation claim.",
            ka: "შეიყვანეთ განაცხადის ნომერი, რომელიც ელ.ფოსტაზე მიიღეთ, და გაეცანით კომპენსაციის განაცხადის მიმდინარე სტატუსს.",
        },
    },
];

async function main() {
    const mode = process.argv[2];

    if (mode !== "--list" && mode !== "--apply") {
        console.error("გამოიყენე --list ან --apply");
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URL);

    if (mode === "--list") {
        const docs = await Meta.find().sort({ path: 1 });
        console.log(`meta კოლექციაში ${docs.length} ჩანაწერია`);
        for (const doc of docs) {
            console.log(`  ${doc.path.padEnd(30)} ${doc.title?.ka || doc.title?.en || "(სათაურის გარეშე)"}`);
        }
        await mongoose.disconnect();
        return;
    }

    for (const record of RECORDS) {
        const existing = await Meta.findOne({ path: record.path });
        if (existing) {
            console.log(`  ხელუხლებელი  ${record.path}  (უკვე არსებობს)`);
            continue;
        }
        await Meta.create(record);
        console.log(`  შეიქმნა      ${record.path}`);
    }

    console.log("\nმზადაა. ტექსტი ახლა ადმინიდან იმართება (მეტა თეგები).");
    await mongoose.disconnect();
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
