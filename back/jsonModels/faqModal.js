const mongoose = require("mongoose");

const localized = () => ({
    en: { type: String, default: "" },
    ka: { type: String, default: "" },
});

// ხშირად დასმული კითხვა. თითო ჩანაწერი ერთი კითხვაა.
//   title      — კითხვა (უბრალო ტექსტი)
//   text       — პასუხი, რედაქტორის HTML (შენახვისას იწმინდება)
//   showOnHome — მთავარ გვერდზე გამოჩნდეს თუ არა (FAQ გვერდზე ყველა ჩანს)
//   order      — რიგითობა (პატარა ნომერი ზემოთ); თანაბარზე — შექმნის რიგი
const FaqSchema = new mongoose.Schema(
    {
        title: localized(),
        text: localized(),
        showOnHome: { type: Boolean, default: false },
        order: { type: Number, default: 0 },
    },
    { timestamps: true }
);

module.exports = mongoose.model("faq", FaqSchema);
