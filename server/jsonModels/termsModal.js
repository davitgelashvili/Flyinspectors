const mongoose = require("mongoose");

const localized = () => ({
    en: { type: String, default: "" },
    ka: { type: String, default: "" },
});

// "წესები და პირობები" გვერდი. ერთი დოკუმენტია (`key` უნიკალურია).
//   title — გვერდის სათაური (უბრალო ტექსტი, საიტზე h1)
//   text  — ტექსტი, რედაქტორის HTML (შენახვისას იწმინდება)
// updatedAt საიტზე "ბოლო განახლების" თარიღად ჩანს.
const TermsSchema = new mongoose.Schema(
    {
        key: { type: String, default: "main", unique: true, immutable: true },
        title: localized(),
        text: localized(),
    },
    { timestamps: true }
);

module.exports = mongoose.model("terms", TermsSchema);
