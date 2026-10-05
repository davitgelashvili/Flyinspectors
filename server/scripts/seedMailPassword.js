/**
 * მეილის აპლიკაციის პაროლის ჩაწერა ბაზაში. კონტროლერები პაროლს აქედან იღებენ,
 * ანუ ამის გაშვების შემდეგ კოდში ხელით ჩაწერილი პაროლი აღარ არის საჭირო.
 *
 * გაშვება:
 *   node scripts/seedMailPassword.js --show
 *   node scripts/seedMailPassword.js --apply "აპლიკაციის პაროლი"
 *   node scripts/seedMailPassword.js --test "mail@example.com"
 *
 * MAIL_SECRET თუ გარემოშია, პაროლი დაშიფრული ჩაიწერება; თუ არა — ღიად.
 * ორივე ფორმა იკითხება, ანუ MAIL_SECRET-ის შემდგომი დამატება არაფერს აფუჭებს:
 * პანელიდან პაროლის ხელახალი შენახვა მას დაშიფრულად გადააწერს.
 */
const mongoose = require("mongoose");
require("dotenv").config();

const { savePassword, readStatus, verifyPassword } = require("../utils/mailer");

async function main() {
    const [mode, value] = process.argv.slice(2);

    if (mode !== "--show" && mode !== "--apply" && mode !== "--test") {
        console.error('გამოიყენე --show | --apply "პაროლი" | --test "mail@example.com"');
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URL);

    if (mode === "--show") {
        console.log(await readStatus());
        await mongoose.disconnect();
        return;
    }

    if (mode === "--test") {
        try {
            await verifyPassword(value || "");
            console.log(value ? `✅ ტესტური წერილი გაიგზავნა: ${value}` : "✅ SMTP კავშირი წარმატებულია");
        } catch (error) {
            console.error("❌ შემოწმება ჩავარდა:", error.message);
            await mongoose.disconnect();
            process.exit(1);
        }
        await mongoose.disconnect();
        return;
    }

    if (!value) {
        console.error('--apply-ს პაროლი სჭირდება: node scripts/seedMailPassword.js --apply "პაროლი"');
        await mongoose.disconnect();
        process.exit(1);
    }

    await savePassword(value);

    const status = await readStatus();
    console.log("✅ პაროლი ბაზაში ჩაიწერა");
    console.log(`   დაშიფრული: ${status.encrypted ? "კი" : "არა (MAIL_SECRET არ არის გარემოში)"}`);
    console.log(`   განახლდა:  ${status.updatedAt}`);

    await mongoose.disconnect();
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
