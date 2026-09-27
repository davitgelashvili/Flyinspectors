const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const ROLES = ["admin", "editor", "user"];

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "invalid email"],
        },
        fullName: {
            type: String,
            required: [true, "fullName is required"],
            trim: true,
        },
        password: {
            type: String,
            required: [true, "password is required"],
            minlength: [8, "password must be at least 8 characters"],
            select: false,
        },
        role: {
            type: String,
            enum: ROLES,
            default: "user",
        },
    },
    { timestamps: true }
);

// ორმაგი დაცვა: select:false query-ებს ფარავს, toJSON ახლად შენახულ დოკუმენტსაც
UserSchema.set("toJSON", {
    transform: (doc, ret) => {
        delete ret.password;
        return ret;
    },
});

UserSchema.pre("save", async function () {
    if (!this.isModified("password") || !this.password) return;
    this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.checkPassword = function (plain) {
    if (!this.password) return false;
    return bcrypt.compare(plain, this.password);
};

const User = mongoose.model("user", UserSchema);

module.exports = User;
module.exports.ROLES = ROLES;
