const How = require("../jsonModels/howModal");
const { createSectionList } = require("./sectionList");

const { get, update } = createSectionList(How, "how-it-works section");

module.exports = { getHow: get, updateHow: update };
