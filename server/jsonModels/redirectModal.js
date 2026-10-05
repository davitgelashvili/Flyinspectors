const mongoose = require("mongoose");

// 301/302 გადამისამართება: ძველი, გაფუჭებული ან წაშლილი მისამართი → ახალი.
//   from   — საიტის მისამართი (ენის prefix-ით ან მის გარეშე), მაგ. "/old-page" ან "/ka/old-page".
//            ინახება უკვე გასუფთავებული: პატარა ასოებით, ბოლო "/"-ის გარეშე
//   to     — ახალი მისამართი: "/ka/new-page" ან სრული "https://..."
//   type   — 301 (მუდმივი) ან 302 (დროებითი)
//   active — გამორთულ გადამისამართებას საიტი არ იყენებს
const RedirectSchema = new mongoose.Schema(
    {
        from: { type: String, required: [true, "from is required"], unique: true, trim: true },
        to: { type: String, required: [true, "to is required"], trim: true },
        type: { type: Number, enum: [301, 302], default: 301 },
        active: { type: Boolean, default: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("redirect", RedirectSchema);
