const Offices = require("../jsonModels/officesModal");
const { sendError } = require("../utils/body");
const { invalid, cleanLocalized } = require("../utils/localized");

const MAX_OFFICES = 6;
const MAX_COUNTRY = 100;
const MAX_ADDRESS = 300;

// ნომერი: ციფრები, "+", ინტერვალი, "-", ფრჩხილები (tel: ბმულისთვის საიმედო ფორმატი)
const PHONE_RE = /^\+?[0-9 ()\-]{5,30}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY = { offices: [] };

// საჯარო. ცარიელზე საიტი სექციას არ ხატავს.
const getOffices = async (req, res) => {
    try {
        const doc = await Offices.findOne({ key: "main" });
        return res.status(200).send(doc || EMPTY);
    } catch (error) {
        return sendError(res, error, "Something went wrong while getting the offices!");
    }
};

const cleanString = (value, label, { re, message, max }) => {
    const text = String(value ?? "").trim();
    if (text.length > max) throw invalid(`${label} is too long (max ${max} characters).`);
    if (text && re && !re.test(text)) throw invalid(message);
    return text;
};

// ოფისების სია მთლიანად იცვლება: რიგი, დამატება და წაშლა ერთი შენახვით
const updateOffices = async (req, res) => {
    try {
        const { offices } = req.body || {};

        if (!Array.isArray(offices)) throw invalid("offices must be an array");
        if (offices.length > MAX_OFFICES) throw invalid(`Too many offices (max ${MAX_OFFICES}).`);

        const clean = offices.map((office, i) => {
            if (office === null || typeof office !== "object") throw invalid(`offices[${i}] must be an object`);

            return {
                country: cleanLocalized(office.country ?? {}, MAX_COUNTRY, `offices[${i}].country`),
                phone: cleanString(office.phone, `offices[${i}].phone`, {
                    re: PHONE_RE,
                    message: `offices[${i}].phone must contain only digits, +, spaces, - and brackets`,
                    max: 30,
                }),
                email: cleanString(office.email, `offices[${i}].email`, {
                    re: EMAIL_RE,
                    message: `offices[${i}].email is not a valid email address`,
                    max: 120,
                }),
                address: cleanLocalized(office.address ?? {}, MAX_ADDRESS, `offices[${i}].address`),
            };
        });

        const doc = await Offices.findOneAndUpdate(
            { key: "main" },
            { $set: { offices: clean } },
            { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
        );

        return res.status(200).send(doc);
    } catch (error) {
        return sendError(res, error, "Something went wrong while updating the offices!");
    }
};

module.exports = { getOffices, updateOffices };
