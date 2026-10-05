const User = require("../jsonModels/userModal");
const { signSession, setSessionCookie, clearSessionCookie } = require("../middleware/auth");
const { sendError } = require("../utils/body");

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send("Email and password are required.");
        }

        const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select("+password");

        // ერთნაირი პასუხი ორივე შემთხვევაზე — თორემ არსებული მომხმარებლების ამოცნობა შეიძლება
        if (!user || !(await user.checkPassword(password))) {
            return res.status(401).send("Invalid credentials.");
        }

        setSessionCookie(res, signSession({ sub: String(user._id), role: user.role }));

        return res.status(200).json(user.toJSON());
    } catch (error) {
        console.error(error);
        return res.status(500).send("Something went wrong during login.");
    }
};

const logout = async (req, res) => {
    clearSessionCookie(res);
    return res.status(200).json({ message: "Logged out" });
};

// ფრონტი ამით ამოწმებს სესიას და როლს.
// try/catch აუცილებელია: ტოკენის sub შეიძლება ObjectId არ იყოს (ძველი ფორმატის
// cookie ან ხელოვნურად შედგენილი) — findById მაშინ CastError-ს ისვრის და
// დაუჭერელი გამონაკლისი პროცესს კლავს.
const me = async (req, res) => {
    try {
        const user = await User.findById(req.user.sub);
        if (!user) return res.status(401).send("Invalid session");

        return res.status(200).json(user.toJSON());
    } catch {
        clearSessionCookie(res);
        return res.status(401).send("Invalid session");
    }
};

// საკუთარი მონაცემების განახლება. `role` განზრახ არ დაიშვება — თორემ
// ნებისმიერი მომხმარებელი თავს admin-ს მიიწერდა ამ endpoint-ით.
const updateMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.sub).select("+password");
        if (!user) return res.status(401).send("Invalid session");

        const { fullName, email, password, currentPassword } = req.body;

        // პაროლის შეცვლა მიმდინარეს დადასტურებას მოითხოვს — თორემ მოპარული
        // სესიით პაროლის შეცვლა და ანგარიშის მითვისება შეიძლებოდა
        if (password) {
            if (!currentPassword) {
                return res.status(400).send("currentPassword is required to change the password.");
            }
            if (!(await user.checkPassword(currentPassword))) {
                return res.status(401).send("Current password is incorrect.");
            }
            user.password = password;
        }

        if (fullName !== undefined) user.fullName = fullName;
        if (email !== undefined) user.email = email;

        const saved = await user.save();

        return res.status(200).json(saved.toJSON());
    } catch (error) {
        if (error && error.code === 11000) {
            return res.status(409).send("Email is already registered.");
        }
        return sendError(res, error, "Something went wrong while updating your profile!");
    }
};

module.exports = { login, logout, me, updateMe };
