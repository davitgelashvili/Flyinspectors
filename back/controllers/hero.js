const Hero = require("../jsonModels/heroModal");
const { createRichSingleton } = require("./richSingleton");

const { get, update } = createRichSingleton(Hero, "hero", {
    title: { limit: 200 },
    accent: { limit: 200 },
    text: { limit: 20000, rich: true },
});

module.exports = { getHero: get, updateHero: update };
