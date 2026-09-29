const { sendError } = require("../utils/body");
const { LANGS, invalid, cleanLocalized } = require("../utils/localized");

const MAX_ITEMS = 24;
const MAX_TITLE = 200;
const MAX_DESC = 2000;

const EMPTY = { sectionTitle: { en: "", ka: "" }, items: [] };

// მთავარი გვერდის სექციებისთვის, რომლებიც "სათაური + ბარათების სიაა":
// { sectionTitle: {en, ka}, items: [{ title: {en, ka}, desc: {en, ka} }] }
// Model-ს უნდა ჰქონდეს `key: "main"` და ეს ორი ველი (იხ. optionsModal.js).
function createSectionList(Model, label) {
    // საჯარო. ცარიელ სიაზე საიტი თავის ნაგულისხმევ ტექსტს იყენებს.
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
            const { sectionTitle, items } = req.body || {};
            const set = {};

            if (sectionTitle !== undefined) {
                // dot-notation — ერთი ენის შენახვა მეორეს არ შლის
                const clean = cleanLocalized(sectionTitle, MAX_TITLE, "sectionTitle", true);
                for (const [lang, text] of Object.entries(clean)) set[`sectionTitle.${lang}`] = text;
            }

            if (items !== undefined) {
                if (!Array.isArray(items)) throw invalid("items must be an array");
                if (items.length > MAX_ITEMS) throw invalid(`Too many items (max ${MAX_ITEMS}).`);

                // მასივი მთლიანად იცვლება: რიგი, დამატება და წაშლა ერთი შენახვით
                set.items = items.map((item, i) => {
                    if (item === null || typeof item !== "object") throw invalid(`items[${i}] must be an object`);
                    return {
                        title: cleanLocalized(item.title ?? {}, MAX_TITLE, `items[${i}].title`),
                        desc: cleanLocalized(item.desc ?? {}, MAX_DESC, `items[${i}].desc`),
                    };
                });
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

module.exports = { createSectionList };
