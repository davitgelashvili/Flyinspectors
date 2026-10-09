const mongoose = require("mongoose");

const localized = () => ({
    en: { type: String, default: "" },
    ka: { type: String, default: "" },
});

// გვერდის მეტა ტეგები (Google-ის შედეგები, Facebook/Twitter/Viber-ის გაზიარების ბარათი).
// თითო გვერდი = ერთი ჩანაწერი; `path` საიტის მისამართია ენის გარეშე ("/", "/faq").
//   title / description — ტექსტი ენის მიხედვით
//   image               — გაზიარების ფოტოს მისამართი (Cloudinary), ენის მიხედვით;
//                         ცარიელია → საიტი მთავარი გვერდის ფოტოს იყენებს
//   imageAlt            — ფოტოს აღწერა (og:image:alt), ენის მიხედვით
const MetaSchema = new mongoose.Schema(
    {
        path: { type: String, required: true, unique: true, immutable: true },
        title: localized(),
        description: localized(),
        image: localized(),
        imageAlt: localized(),
    },
    { timestamps: true }
);

module.exports = mongoose.model("meta", MetaSchema);
