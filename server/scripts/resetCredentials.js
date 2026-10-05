/**
 * არსებული ანგარიშების პაროლების შეცვლა და როლების მინიჭება.
 *
 * საჭიროა, რადგან პაროლები /api/company-ით საჯაროდ იკითხებოდა ღია ტექსტით,
 * ანუ კომპრომეტირებულია — დაჰეშვა საკმარისი არ არის, საჭიროა ახლები.
 *
 * გაშვება:
 *   node scripts/resetCredentials.js --list      მხოლოდ აჩვენებს ანგარიშებს (არაფერს ცვლის)
 *   node scripts/resetCredentials.js --apply     ცვლის პაროლებს და ბეჭდავს ახლებს
 *
 * ახალი პაროლები ერთხელ დაიბეჭდება — შეინახე მაშინვე.
 */
const mongoose = require("mongoose");
const crypto = require("crypto");
require("dotenv").config();

const CompanyModal = require("../jsonModels/companyModal");

const ROLE_BY_USERNAME = {
    // userName: role   —  შეავსე საჭიროებისამებრ
    // "info@flyinspectors.com": "admin",
};
const DEFAULT_ROLE = "content";

function strongPassword() {
    // 18 სიმბოლო, ბუნდოვანი სიმბოლოების გარეშე (0/O, 1/l/I)
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#%*";
    return Array.from(crypto.randomBytes(18))
        .map((b) => alphabet[b % alphabet.length])
        .join("");
}

async function main() {
    const mode = process.argv[2];
    if (mode !== "--list" && mode !== "--apply") {
        console.error("გამოიყენე --list ან --apply");
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URL);

    const users = await CompanyModal.find().select("+password");
    console.log(`ნაპოვნია ${users.length} ანგარიში\n`);

    if (mode === "--list") {
        for (const u of users) {
            const hashed = /^\$2[aby]\$/.test(u.password || "");
            console.log(
                `${(u.userName || "(სახელის გარეშე)").padEnd(34)} role: ${(u.role || "—").padEnd(8)} პაროლი: ${hashed ? "ჰეშირებული" : "ღია ტექსტი ❌"}`
            );
        }
        console.log("\nარაფერი შეცვლილა. შეცვლისთვის: --apply");
        await mongoose.disconnect();
        return;
    }

    const results = [];
    for (const u of users) {
        const password = strongPassword();
        u.password = password; // pre-save hook დაჰეშავს
        u.role = ROLE_BY_USERNAME[u.userName] || u.role || DEFAULT_ROLE;
        await u.save();
        results.push({ userName: u.userName, role: u.role, password });
    }

    console.log("ახალი მონაცემები — ერთხელ ჩანს, შეინახე ახლავე:\n");
    for (const r of results) {
        console.log(`  ${(r.userName || "(სახელის გარეშე)").padEnd(34)} ${r.role.padEnd(8)} ${r.password}`);
    }

    await mongoose.disconnect();
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
