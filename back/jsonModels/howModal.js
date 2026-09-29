const mongoose = require("mongoose");

const localized = () => ({
    en: { type: String, default: "" },
    ka: { type: String, default: "" },
});

// მთავარი გვერდის "როგორ მუშაობს" სექცია. ერთი დოკუმენტია (`key` უნიკალურია).
// items-ის რიგი საფეხურების რიგია საიტზე (01, 02, ...).
const HowSchema = new mongoose.Schema(
    {
        key: { type: String, default: "main", unique: true, immutable: true },
        sectionTitle: localized(),
        items: [
            {
                title: localized(),
                desc: localized(),
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("how", HowSchema);
