const { sendError } = require("../utils/body");
const { sanitizeHtml } = require("../utils/sanitizeHtml");
const { cleanLocalized } = require("../utils/localized");

// ერთდოკუმენტიანი სექციებისთვის, რომლებსაც ორენოვანი ველები აქვთ:
//   fields = { title: { limit: 200 }, text: { limit: 20000, rich: true } }
// rich: true — რედაქტორის HTML; შენახვისას იწმინდება (utils/sanitizeHtml.js).
// დანარჩენი — უბრალო ტექსტი. Model-ს უნდა ჰქონდეს `key: "main"` და ეს ველები.
function createRichSingleton(Model, label, fields) {
    const names = Object.keys(fields);
    const EMPTY = Object.fromEntries(names.map((name) => [name, { en: "", ka: "" }]));

    // საჯარო. ცარიელ ველზე საიტი თავის ნაგულისხმევ ტექსტს იყენებს.
    const get = async (req, res) => {
        try {
            const doc = await Model.findOne({ key: "main" });
            return res.status(200).send(doc || EMPTY);
        } catch (error) {
            return sendError(res, error, `Something went wrong while getting the ${label}!`);
        }
    };

    const update = async (req, res) => {
        try {
            const body = req.body || {};
            const set = {};

            for (const name of names) {
                if (body[name] === undefined) continue;

                const { limit, rich } = fields[name];
                // partial: ერთი ენის შენახვა მეორეს არ შლის (dot-notation)
                const clean = cleanLocalized(body[name], limit, name, true);
                for (const [lang, text] of Object.entries(clean)) {
                    set[`${name}.${lang}`] = rich ? sanitizeHtml(text) : text;
                }
            }

            if (!Object.keys(set).length) return res.status(400).send("Nothing to update.");

            const doc = await Model.findOneAndUpdate(
                { key: "main" },
                { $set: set },
                { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
            );

            return res.status(200).send(doc);
        } catch (error) {
            return sendError(res, error, `Something went wrong while updating the ${label}!`);
        }
    };

    return { get, update };
}

module.exports = { createRichSingleton };
