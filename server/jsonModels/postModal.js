const mongoose = require("mongoose");

// ბლოგის სტატიები /[lang]/blog/[slug] მისამართზე; სია — /[lang]/blog.
// slug: მხოლოდ lowercase ლათინური, ციფრი და დეფისი (URL სტრუქტურის მოთხოვნა).
// ტექსტი ორენოვანია; თარგმანის გარეშე საიტი ინგლისურს აჩვენებს (იგივე წესი, რაც გვერდებს).
const localized = () => ({
    en: { type: String, default: "" },
    ka: { type: String, default: "" },
});

const PostSchema = new mongoose.Schema(
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
        // ქოვერი: სიის ბარათზე, სტატიის თავში და გაზიარების ფოტოდ (og:image)
        cover: { type: String, default: "" },
        coverAlt: localized(),
        title: localized(),
        // მოკლე აღწერა — სიის ბარათზე ჩანს; ცარიელია → metaDescription-ს ვიყენებთ
        excerpt: localized(),
        content: localized(),
        metaTitle: localized(),
        metaDescription: localized(),
        published: { type: Boolean, default: true },
        // სიის დალაგება და <time>/schema.org. createdAt-ს არ ვენდობით: ძველი სტატიის
        // ბაზაში შეტანისას გამოქვეყნების თარიღი ხელით უნდა მიეთითოს.
        publishedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

// სია ყოველთვის თარიღით ლაგდება — ინდექსი ამ მოთხოვნას ემსახურება
PostSchema.index({ published: 1, publishedAt: -1 });

module.exports = mongoose.model("post", PostSchema);
