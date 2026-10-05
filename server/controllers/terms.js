const Terms = require("../jsonModels/termsModal");
const { createRichSingleton } = require("./richSingleton");

// იურიდიული ტექსტი გრძელია, ამიტომ ლიმიტი სხვა სექციებზე მაღალია
const { get, update } = createRichSingleton(Terms, "terms and conditions", {
    title: { limit: 200 },
    text: { limit: 100000, rich: true },
});

module.exports = { getTerms: get, updateTerms: update };
