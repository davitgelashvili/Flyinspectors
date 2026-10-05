const User = require("../jsonModels/userModal");
const { sendError } = require("../utils/body");

// საჯარო რეგისტრაცია. role spread-ის შემდეგ იწერება, ანუ გარედან ვერ დაყენდება —
// თორემ ნებისმიერი დამრეგისტრირებელი თავს admin-ს მიიწერდა.
const register = async (req, res) => {
    try {
        const user = new User({
            ...req.body,
            role: "user",
        });

        const saved = await user.save();

        return res.status(201).send(saved);
    } catch (error) {
        if (error && error.code === 11000) {
            return res.status(409).send("Email is already registered.");
        }
        return sendError(res, error, "Something went wrong while registering!");
    }
};

const getUsers = async (req, res) => {
    try {
        const { role } = req.query;
        const filter = role ? { role } : {};

        return res.status(200).send(await User.find(filter).sort({ createdAt: -1 }));
    } catch (error) {
        return sendError(res, error, "Something went wrong while getting users!");
    }
};

// მხოლოდ admin-ს შეუძლია — აქ role დაშვებულია განზრახ
const createUser = async (req, res) => {
    try {
        const user = new User(req.body);
        const saved = await user.save();

        return res.status(201).send(saved);
    } catch (error) {
        if (error && error.code === 11000) {
            return res.status(409).send("Email is already registered.");
        }
        return sendError(res, error, "Something went wrong while creating the user!");
    }
};

const updateUser = async (req, res) => {
    try {
        const { id, password, ...updates } = req.body;
        if (!id) return res.status(400).send("id is required.");

        const user = await User.findById(id).select("+password");
        if (!user) return res.status(404).send("User not found.");

        Object.assign(user, updates);
        // ცალკე, რომ pre('save') hook-მა დაჰეშოს
        if (password) user.password = password;

        const saved = await user.save();

        return res.status(200).send(saved);
    } catch (error) {
        if (error && error.code === 11000) {
            return res.status(409).send("Email is already registered.");
        }
        return sendError(res, error, "Something went wrong while updating the user!");
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) return res.status(400).send("id is required.");

        if (id === req.user.sub) {
            return res.status(400).send("You cannot delete your own account.");
        }

        const deleted = await User.findByIdAndDelete(id);
        if (!deleted) return res.status(404).send("User not found.");

        return res.status(200).send({ message: "User deleted", id });
    } catch (error) {
        return sendError(res, error, "Something went wrong while deleting the user!");
    }
};

module.exports = { register, getUsers, createUser, updateUser, deleteUser };
