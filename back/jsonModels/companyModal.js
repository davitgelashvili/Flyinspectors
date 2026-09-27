const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const CompanySchema = new mongoose.Schema({
    companyId: {
        type: String,
        required: false,
    },
    title: {
        type: String,
        required: false,
    },
    userName: {
        type: String,
        required: false,
    },
    // select: false — პაროლი ნაგულისხმევად არც ერთ query-ში არ მოყვება
    password: {
        type: String,
        required: false,
        select: false,
    },
    document: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        enum: ["content", "claims", "admin"],
        default: "content",
    },
});

// ორმაგი დაცვა: select:false query-ებს ფარავს, ეს კი ახლად შენახულ დოკუმენტსაც
CompanySchema.set("toJSON", {
    transform: (doc, ret) => {
        delete ret.password;
        return ret;
    },
});

CompanySchema.pre("save", async function () {
    if (!this.isModified("password") || !this.password) return;
    this.password = await bcrypt.hash(this.password, 10);
});

CompanySchema.methods.checkPassword = function (plain) {
    if (!this.password) return false;
    return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model("company", CompanySchema);
