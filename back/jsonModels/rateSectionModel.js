const mongoose = require("mongoose");

const RateSchema = new mongoose.Schema({
    id: {
        type: String,
        required: false,
    },
    title: {
        type: Object,
        required: false,
    },
    description: {
        type: Object,
        required: false,
    },
    icon: {
        type: String,
        required: false,
    },
});

module.exports = mongoose.model("rates", RateSchema);
