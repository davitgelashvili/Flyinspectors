const Page = require("../jsonModels/pageModal");
const { sendError } = require("../utils/body");
const { sanitizeRichField } = require("../utils/sanitizeHtml");

// საჯარო: საიტს სჭირდება. ადმინს სრული სია, საიტს მხოლოდ გამოქვეყნებული.
const getPages = async (req, res) => {
    try {
        const all = req.query.all === "true";
        const filter = all ? {} : { published: true };

        return res.status(200).send(await Page.find(filter).sort({ createdAt: -1 }));
    } catch (error) {
        return sendError(res, error, "Something went wrong while getting pages!");
    }
};

const getPageBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const page = await Page.findOne({ slug: String(slug).toLowerCase().trim() });
        if (!page) return res.status(404).send("Page not found.");

        return res.status(200).send(page);
    } catch (error) {
        return sendError(res, error, "Something went wrong while getting the page!");
    }
};

const createPage = async (req, res) => {
    try {
        const created = await Page.create(sanitizeRichField(req.body));
        return res.status(201).send(created);
    } catch (error) {
        if (error && error.code === 11000) {
            return res.status(409).send("A page with this link already exists.");
        }
        return sendError(res, error, "Something went wrong while creating the page!");
    }
};

const updatePage = async (req, res) => {
    try {
        // _id საძიებო გასაღებია — განახლებაში არ უნდა მოხვდეს
        const { _id, ...updates } = sanitizeRichField(req.body);
        if (!_id) return res.status(400).send("_id is required.");

        const updated = await Page.findByIdAndUpdate(_id, updates, {
            new: true,
            runValidators: true,
        });

        if (!updated) return res.status(404).send("Page not found.");

        return res.status(200).send(updated);
    } catch (error) {
        if (error && error.code === 11000) {
            return res.status(409).send("A page with this link already exists.");
        }
        return sendError(res, error, "Something went wrong while updating the page!");
    }
};

const deletePage = async (req, res) => {
    try {
        const { _id } = req.body;
        if (!_id) return res.status(400).send("_id is required.");

        const deleted = await Page.findByIdAndDelete(_id);
        if (!deleted) return res.status(404).send("Page not found.");

        return res.status(200).send({ message: "Page deleted", _id });
    } catch (error) {
        return sendError(res, error, "Something went wrong while deleting the page!");
    }
};

module.exports = { getPages, getPageBySlug, createPage, updatePage, deletePage };
