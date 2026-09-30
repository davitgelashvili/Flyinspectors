const mongoose = require("mongoose");

const localized = () => ({
    en: { type: String, default: "" },
    ka: { type: String, default: "" },
});

// საკონტაქტო გვერდის ოფისები (ქვეყნების მიხედვით). ერთი დოკუმენტია (`key` უნიკალურია),
// offices-ის რიგი საიტზე ოფისების რიგია.
//   country — ქვეყნის სახელი ენის მიხედვით
//   phone   — ტელეფონი (ენისგან დამოუკიდებელი)
//   email   — ელფოსტა (ენისგან დამოუკიდებელი)
//   address — მისამართი ენის მიხედვით
// ძველი `contacts` კოლექცია (/api/contactlist) ძველი საიტისთვისაა და აქ არ გამოიყენება.
const OfficesSchema = new mongoose.Schema(
    {
        key: { type: String, default: "main", unique: true, immutable: true },
        offices: [
            {
                country: localized(),
                phone: { type: String, default: "" },
                email: { type: String, default: "" },
                address: localized(),
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("offices", OfficesSchema);
