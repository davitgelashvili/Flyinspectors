const Faq = require("../jsonModels/faqModal");
const { sendError } = require("../utils/body");
const { sanitizeHtml } = require("../utils/sanitizeHtml");
const { invalid, cleanLocalized } = require("../utils/localized");

const MAX_TITLE = 300;
const MAX_TEXT = 20000;
const SORT = { order: 1, createdAt: 1 };

// საჯარო. ?home=true — მხოლოდ მთავარ გვერდზე მონიშნულები.
const getFaqs = async (req, res) => {
    try {
        const filter = req.query.home === "true" ? { showOnHome: true } : {};
        return res.status(200).send(await Faq.find(filter).sort(SORT));
    } catch (error) {
        return sendError(res, error, "Something went wrong while getting the FAQ!");
    }
};

// body-დან მხოლოდ ნებადართულ ველებს ვიღებთ (არ ვაძლევთ მომხმარებელს _id-ის, createdAt-ის
// და სხვა სისტემური ველის შეცვლას). partial — არგადმოცემული ველი/ენა უცვლელი რჩება.
function pickUpdates(body, { requireTitle }) {
    const set = {};

    if (body.title !== undefined) {
        const clean = cleanLocalized(body.title, MAX_TITLE, "title", true);
        for (const [lang, text] of Object.entries(clean)) set[`title.${lang}`] = text;
    }

    if (body.text !== undefined) {
        const clean = cleanLocalized(body.text, MAX_TEXT, "text", true);
        for (const [lang, text] of Object.entries(clean)) set[`text.${lang}`] = sanitizeHtml(text);
    }

    if (body.showOnHome !== undefined) {
        if (typeof body.showOnHome !== "boolean") throw invalid("showOnHome must be true or false");
        set.showOnHome = body.showOnHome;
    }

    if (body.order !== undefined) {
        const order = Number(body.order);
        if (!Number.isFinite(order)) throw invalid("order must be a number");
        set.order = order;
    }

    if (requireTitle && !set["title.ka"] && !set["title.en"]) {
        throw invalid("A title is required (at least in one language).");
    }

    return set;
}

const createFaq = async (req, res) => {
    try {
        const set = pickUpdates(req.body || {}, { requireTitle: true });

        // dot-notation-ი create-ზე არ მუშაობს — ობიექტად ვაგებთ
        const doc = { title: {}, text: {} };
        for (const [key, value] of Object.entries(set)) {
            const [field, lang] = key.split(".");
            if (lang) doc[field][lang] = value;
            else doc[field] = value;
        }

        return res.status(201).send(await Faq.create(doc));
    } catch (error) {
        return sendError(res, error, "Something went wrong while creating the FAQ!");
    }
};

const updateFaq = async (req, res) => {
    try {
        const { _id } = req.body || {};
        if (!_id) return res.status(400).send("_id is required.");

        const set = pickUpdates(req.body, { requireTitle: false });
        if (!Object.keys(set).length) return res.status(400).send("Nothing to update.");

        const updated = await Faq.findByIdAndUpdate(_id, { $set: set }, { new: true, runValidators: true });
        if (!updated) return res.status(404).send("FAQ not found.");

        return res.status(200).send(updated);
    } catch (error) {
        return sendError(res, error, "Something went wrong while updating the FAQ!");
    }
};

const deleteFaq = async (req, res) => {
    try {
        const { _id } = req.body || {};
        if (!_id) return res.status(400).send("_id is required.");

        const deleted = await Faq.findByIdAndDelete(_id);
        if (!deleted) return res.status(404).send("FAQ not found.");

        return res.status(200).send({ message: "FAQ deleted", _id });
    } catch (error) {
        return sendError(res, error, "Something went wrong while deleting the FAQ!");
    }
};

module.exports = { getFaqs, createFaq, updateFaq, deleteFaq };
