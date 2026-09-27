const mongoose = require("mongoose");

const ContactsSchema = new mongoose.Schema({
    call: {
        type: Object,
        required: false,
    },
    email: {
        type: Object,
        required: false,
    },
    address: {
        type: Object,
        required: false,
    }
});

module.exports = mongoose.model("contacts", ContactsSchema);
