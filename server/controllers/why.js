const Why = require("../jsonModels/whyModal");
const { createRichSingleton } = require("./richSingleton");

const { get, update } = createRichSingleton(Why, "why section", {
    title: { limit: 200 },
    text: { limit: 20000, rich: true },
});

module.exports = { getWhy: get, updateWhy: update };
