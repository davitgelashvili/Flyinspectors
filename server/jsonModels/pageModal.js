const mongoose = require("mongoose");

// გვერდები /[lang]/[slug] მისამართზე ცხოვრობენ. სტატიკური მარშრუტი (about-us, faq...) ყოველთვის
// ჯობია, ამიტომ იგივე slug-ით შექმნილი გვერდი საიტზე ვერ გამოჩნდება — ასეთ slug-ებს ნუ დავასახელებთ.
// slug: მხოლოდ lowercase ლათინური, ციფრი და დეფისი (URL სტრუქტურის მოთხოვნა).
const localized = () => ({
    en: { type: String, default: "" },
    ka: { type: String, default: "" },
});

const PageSchema = new mongoose.Schema(
    {
        slug: {
            type: String,
            required: [true, "slug is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                "slug may contain only lowercase latin letters, digits and dashes",
            ],
        },
        cover: { type: String, default: "" },
        title: localized(),
        metaTitle: localized(),
        metaDescription: localized(),
        content: localized(),
        published: { type: Boolean, default: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("page", PageSchema);
