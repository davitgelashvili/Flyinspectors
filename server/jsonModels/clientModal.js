const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema({
    passportImage: {
        type: String,
        required: false,
    },
    ticketImage: {
        type: String,
        required: false,
    },
    otherImage: {
        type: String,
        required: false,
    },
    signature: {
        public_id: String,
        url: String,
        type: String,
        required: true,
    },
    companyId: {
        type: String,
        required: false,
    },
    userId: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    problem: {
        type: String,
        required: true,
    },
    flightNumber: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    select: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        required: true,
    },
    oldStatus: {
        type: String,
        required: true,
    },
    createDate: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model("clients", ClientSchema);
