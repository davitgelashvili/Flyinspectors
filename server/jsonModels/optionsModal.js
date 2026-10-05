const mongoose = require("mongoose");

const localized = () => ({
    en: { type: String, default: "" },
    ka: { type: String, default: "" },
});

// მთავარი გვერდის "გეკუთვნით კომპენსაცია?" სექცია. ერთი დოკუმენტია (`key` უნიკალურია).
// items-ის რიგი ბარათების რიგია საიტზე.
const OptionsSchema = new mongoose.Schema(
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

module.exports = mongoose.model("options", OptionsSchema);
