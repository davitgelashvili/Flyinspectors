const Meta = require("../jsonModels/metaModal");
const { sendError } = require("../utils/body");
const { invalid, cleanLocalized } = require("../utils/localized");

const MAX_TITLE = 200;
const MAX_DESCRIPTION = 500;
const MAX_IMAGE = 1000;
const MAX_IMAGE_ALT = 300;

// "/", "/your-rights/flight-delay" — ენის გარეშე, პატარა ლათინური ასოები, ციფრები, "-" და "/"
const PATH_RE = /^\/[a-z0-9/-]*$/;
const URL_RE = /^https?:\/\/\S+$/i;

// საჯარო: საიტს ყველა გვერდის მეტა სჭირდება; ერთი მოთხოვნით ვაბრუნებთ ყველას.
const getMeta = async (req, res) => {
    try {
        return res.status(200).send(await Meta.find().sort({ path: 1 }));
    } catch (error) {
        return sendError(res, error, "Something went wrong while getting the meta tags!");
    }
};

// ერთი გვერდის შენახვა (upsert). არგადმოცემული ველი/ენა უცვლელი რჩება;
// ცარიელი სტრიქონი ველს ასუფთავებს.
const updateMeta = async (req, res) => {
    try {
        const body = req.body || {};

        if (typeof body.path !== "string" || !PATH_RE.test(body.path) || body.path.length > 200) {
            throw invalid("path must look like /your-rights/flight-delay");
        }

        const set = {};
        const fields = [
            ["title", MAX_TITLE],
            ["description", MAX_DESCRIPTION],
            ["image", MAX_IMAGE],
            ["imageAlt", MAX_IMAGE_ALT],
        ];

        for (const [name, limit] of fields) {
            if (body[name] === undefined) continue;

            const clean = cleanLocalized(body[name], limit, name, true);
            for (const [lang, value] of Object.entries(clean)) {
                // სურათი მხოლოდ http(s) მისამართი უნდა იყოს (javascript: და მისთანები არ გადის)
                if (name === "image" && value && !URL_RE.test(value)) {
                    throw invalid(`image "${lang}" must be an http(s) URL`);
                }
                set[`${name}.${lang}`] = value;
            }
        }

        if (!Object.keys(set).length) return res.status(400).send("Nothing to update.");

        const doc = await Meta.findOneAndUpdate(
            { path: body.path },
            { $set: set },
            { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
        );

        return res.status(200).send(doc);
    } catch (error) {
        return sendError(res, error, "Something went wrong while updating the meta tags!");
    }
};

module.exports = { getMeta, updateMeta };
