/**
 * მეტა ტეგების ჩანაწერის მისამართის გადარქმევა.
 *
 * საიტზე გვერდის მისამართის შეცვლისას (მაგ. /about-us/faq → /faq) ბაზაში მისი მეტა
 * ჩანაწერი ძველ მისამართზე რჩება და გვერდი სათაურსა და აღწერას კარგავს.
 * სქემაში `path` immutable-ია, ამიტომ mongoose-ით ვერ იცვლება — კოლექციას პირდაპირ ვწერთ.
 *
 * გაშვება:
 *   node scripts/renameMetaPath.js --list
 *   node scripts/renameMetaPath.js --apply "/about-us/faq" "/faq"
 */
const mongoose = require("mongoose");
require("dotenv").config();

async function main() {
    const [mode, from, to] = process.argv.slice(2);

    if (mode !== "--list" && mode !== "--apply") {
        console.error('გამოიყენე --list ან --apply "/ძველი" "/ახალი"');
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URL);
    const meta = mongoose.connection.db.collection("meta");

    if (mode === "--list") {
        const docs = await meta.find({}, { projection: { path: 1, title: 1 } }).sort({ path: 1 }).toArray();
        console.log(`meta კოლექციაში ${docs.length} ჩანაწერია`);
        for (const doc of docs) {
            console.log(`  ${String(doc.path).padEnd(30)} ${doc.title?.ka || doc.title?.en || "(სათაურის გარეშე)"}`);
        }
        await mongoose.disconnect();
        return;
    }

    if (!from || !to) {
        console.error('--apply-ს სჭირდება: node scripts/renameMetaPath.js --apply "/ძველი" "/ახალი"');
        await mongoose.disconnect();
        process.exit(1);
    }

    const source = await meta.findOne({ path: from });
    if (!source) {
        console.error(`"${from}" ვერ მოიძებნა — გადასარქმევი არაფერია (--list აჩვენებს ყველას)`);
        await mongoose.disconnect();
        process.exit(1);
    }

    // `path` უნიკალურია: თუ ახალი მისამართი უკვე დაკავებულია, ჩანაწერს არ ვაფუჭებთ
    const target = await meta.findOne({ path: to });
    if (target) {
        console.error(`"${to}" უკვე არსებობს — ხელით გადაწყვიტე რომელი დარჩეს`);
        await mongoose.disconnect();
        process.exit(1);
    }

    await meta.updateOne({ _id: source._id }, { $set: { path: to } });
    console.log(`"${from}" → "${to}" გადარქმეულია`);
    console.log("ადმინში ცვლილება მაშინვე ჩანს; საიტზე — მაქსიმუმ 60 წამში.");

    await mongoose.disconnect();
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
