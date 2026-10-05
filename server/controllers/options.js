const Options = require("../jsonModels/optionsModal");
const { createSectionList } = require("./sectionList");

const { get, update } = createSectionList(Options, "options");

module.exports = { getOptions: get, updateOptions: update };
