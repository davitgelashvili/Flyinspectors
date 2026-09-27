const mongoose = require("mongoose");

const ServicesSchema = new mongoose.Schema({
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
    }
});

module.exports = mongoose.model("services", ServicesSchema);
