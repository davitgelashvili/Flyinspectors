const mongoose = require("mongoose");

const localized = () => ({
    en: { type: String, default: "" },
    ka: { type: String, default: "" },
});

// მთავარი გვერდის "რატომ Flyinspectors" სექციის მარცხენა ნაწილი. ერთი დოკუმენტია.
//   title — სათაური (უბრალო ტექსტი, h2)
//   text  — ტექსტი, რედაქტორის HTML (შენახვისას იწმინდება)
// მარჯვენა ბარათი (8 / 10) სტატიკურია და საიტის კოდშია.
const WhySchema = new mongoose.Schema(
    {
        key: { type: String, default: "main", unique: true, immutable: true },
        title: localized(),
        text: localized(),
    },
    { timestamps: true }
);

module.exports = mongoose.model("why", WhySchema);
