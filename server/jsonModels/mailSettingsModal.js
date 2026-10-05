const mongoose = require("mongoose");

// მეილის აპლიკაციის პაროლი ერთადერთ ჩანაწერში ინახება: `key` unique-ია,
// ამიტომ მეორე დოკუმენტი ვერ გაჩნდება და "რომელია მართებული" კითხვა არ ისმის.
const MailSettingsSchema = new mongoose.Schema(
    {
        key: {
            type: String,
            default: "smtp",
            unique: true,
        },
        // აპლიკაციის პაროლი. select:false — შემთხვევით არ წამოვიდეს სხვა query-ში.
        pass: {
            type: String,
            default: "",
            select: false,
        },
        // true → `pass` AES-256-GCM-ითაა დაშიფრული. ველი ჩანაწერშივე გვიწერია,
        // რომ გაშიფვრა მიხვედრით არ ხდებოდეს — ღია ჩანაწერიც იკითხება.
        passEncrypted: {
            type: Boolean,
            default: false,
            select: false,
        },
    },
    { timestamps: true }
);

// ორმაგი დაცვა: select:false query-ებს ფარავს, toJSON კი შენახულ დოკუმენტს
MailSettingsSchema.set("toJSON", {
    transform: (doc, ret) => {
        delete ret.pass;
        delete ret.passEncrypted;
        return ret;
    },
});

module.exports = mongoose.model("mailsettings", MailSettingsSchema);
