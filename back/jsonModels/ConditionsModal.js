const mongoose = require("mongoose");
const { all } = require("../router");

const ConditionsSchema = new mongoose.Schema({
    title: {
        type: Object,
        required: false,
    },
    description: {
        type: Object,
        required: false,
    }
});

module.exports = mongoose.model("conditions", ConditionsSchema);
