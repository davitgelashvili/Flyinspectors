const { savePassword, readStatus, verifyPassword } = require("../utils/mailer");
const { sendError } = require("../utils/body");

// პასუხი პაროლს არასოდეს შეიცავს — მხოლოდ იმას, დაყენებულია თუ არა
const getMailPassword = async (req, res) => {
    try {
        return res.status(200).json(await readStatus());
    } catch (error) {
        return sendError(res, error, "Something went wrong while getting the mail password!");
    }
};

const updateMailPassword = async (req, res) => {
    try {
        const pass = req.body && req.body.pass ? String(req.body.pass).trim() : "";

        // ცარიელს არ ვიღებთ — თორემ შემთხვევითი შენახვა მეილს გაათიშავდა
        if (!pass) return res.status(400).send("pass is required.");

        await savePassword(pass);

        return res.status(200).json(await readStatus());
    } catch (error) {
        return sendError(res, error, "Something went wrong while saving the mail password!");
    }
};

const testMailPassword = async (req, res) => {
    try {
        const to = req.body && req.body.to ? String(req.body.to).trim() : "";

        await verifyPassword(to);

        return res.status(200).json({
            ok: true,
            message: to ? `ტესტური წერილი გაიგზავნა: ${to}` : "SMTP კავშირი წარმატებულია",
        });
    } catch (error) {
        console.error("❌ SMTP test failed:", error);
        return res.status(400).json({
            ok: false,
            message: error.message || "შემოწმება ვერ მოხერხდა",
        });
    }
};

module.exports = { getMailPassword, updateMailPassword, testMailPassword };
