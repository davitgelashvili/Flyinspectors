/**
 * პირველი admin მომხმარებლის შექმნა. ლოგინი ახლა users კოლექციას ეყრდნობა,
 * ანუ ამის გაშვების გარეშე ადმინში შესვლა შეუძლებელია.
 *
 * გაშვება:
 *   node scripts/seedAdmin.js --list
 *   node scripts/seedAdmin.js --apply "email@example.com" "სრული სახელი"
 *
 * პაროლი შემთხვევით გენერირდება და ერთხელ დაიბეჭდება.
 */
const mongoose = require("mongoose");
const crypto = require("crypto");
require("dotenv").config();

const User = require("../jsonModels/userModal");

function strongPassword() {
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
    return Array.from(crypto.randomBytes(16))
        .map((b) => alphabet[b % alphabet.length])
        .join("");
}

async function main() {
    const [mode, email, fullName] = process.argv.slice(2);

    if (mode !== "--list" && mode !== "--apply") {
        console.error('გამოიყენე --list ან --apply "email" "სრული სახელი"');
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URL);

    if (mode === "--list") {
        const users = await User.find().sort({ createdAt: -1 });
        console.log(`users კოლექციაში ${users.length} ჩანაწერია`);
        for (const u of users) {
            console.log(`  ${u.email.padEnd(34)} ${u.role.padEnd(8)} ${u.fullName}`);
        }
        await mongoose.disconnect();
        return;
    }

    if (!email || !fullName) {
        console.error('--apply-ს სჭირდება: node scripts/seedAdmin.js --apply "email" "სრული სახელი"');
        await mongoose.disconnect();
        process.exit(1);
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
        console.error(`${email} უკვე არსებობს (role: ${existing.role})`);
        await mongoose.disconnect();
        process.exit(1);
    }

    const password = strongPassword();
    await User.create({ email, fullName, password, role: "admin" });

    console.log("admin შეიქმნა — პაროლი ერთხელ ჩანს, შეინახე ახლავე:\n");
    console.log(`  email:    ${email}`);
    console.log(`  password: ${password}`);

    await mongoose.disconnect();
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
