const mongoose = require("mongoose");

const localized = () => ({
    en: { type: String, default: "" },
    ka: { type: String, default: "" },
});

// მთავარი გვერდის ზედა (hero) ბლოკი. ერთი დოკუმენტია, ამიტომ `key` უნიკალურია.
//   title  — სათაური (უბრალო ტექსტი, h1)
//   accent — სათაურის ნარინჯისფერი ნაწილი (უბრალო ტექსტი)
//   text   — აღწერა, რედაქტორის HTML (შენახვისას იწმინდება)
const HeroSchema = new mongoose.Schema(
    {
        key: { type: String, default: "main", unique: true, immutable: true },
        title: localized(),
        accent: localized(),
        text: localized(),
    },
    { timestamps: true }
);

module.exports = mongoose.model("hero", HeroSchema);
