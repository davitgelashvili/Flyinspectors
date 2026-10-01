const Redirect = require("../jsonModels/redirectModal");
const { sendError } = require("../utils/body");
const { invalid } = require("../utils/localized");

const MAX_LENGTH = 500;

// "/Old-Page/" → "/old-page" (საიტი მისამართებს ასე ადარებს: middleware-ი ასოებს ამცირებს და ბოლო "/"-ს იშორებს)
const normalizeFrom = (value) => {
    let from = String(value ?? "").trim();
    if (!from.startsWith("/") || from.startsWith("//")) throw invalid('"from" must start with a single "/"');
    if (/[\s?#]/.test(from)) throw invalid('"from" must be a path only: no spaces, "?" or "#"');
    if (from.length > MAX_LENGTH) throw invalid(`"from" is too long (max ${MAX_LENGTH}).`);

    from = from.replace(/\/{2,}/g, "/").replace(/%[0-9a-f]{2}|[A-Z]/gi, (m) => (m[0] === "%" ? m : m.toLowerCase()));
    if (from.length > 1) from = from.replace(/\/$/, "");
    if (from === "/") throw invalid('"from" cannot be the home page "/"');
    if (/^\/(adminpanel|api|_next)(\/|$)/.test(from)) throw invalid('"from" cannot be an admin, api or system path');
    return from;
};

// "/ka/page" ან "https://example.com/page". javascript: და მისთანები არ გადის.
const cleanTo = (value) => {
    const to = String(value ?? "").trim();
    if (to.length > MAX_LENGTH) throw invalid(`"to" is too long (max ${MAX_LENGTH}).`);
    const internal = to.startsWith("/") && !to.startsWith("//");
    if (!internal && !/^https?:\/\/\S+$/i.test(to)) throw invalid('"to" must be a path like /ka/page or a full http(s) URL');
    return to;
};

const cleanType = (value) => {
    const type = Number(value ?? 301);
    if (![301, 302].includes(type)) throw invalid('"type" must be 301 or 302');
    return type;
};

// ბოლო "/"-ის გარეშე შედარებისთვის
const sameTarget = (a, b) => a.replace(/\/$/, "").toLowerCase() === b.replace(/\/$/, "").toLowerCase();

// საკუთარ თავზე ან ორ მისამართს შორის წრეზე გადამისამართება საიტს შეაჩერებდა
async function assertNoLoop(from, to, ignoreId) {
    if (sameTarget(from, to)) throw invalid('"from" and "to" must be different');
    const back = await Redirect.findOne({ from: to.toLowerCase().replace(/\/$/, ""), active: true });
    if (back && String(back._id) !== String(ignoreId) && sameTarget(back.to, from)) {
        throw invalid(`This would create a loop with the existing redirect ${back.from} → ${back.to}`);
    }
}

// საჯარო: საიტის middleware-ს სჭირდება. მხოლოდ ჩართული გადამისამართებები, მინიმალური ველებით.
const getActiveRedirects = async (req, res) => {
    try {
        const list = await Redirect.find({ active: true }).select("from to type -_id").lean();
        return res.status(200).send(list);
    } catch (error) {
        return sendError(res, error, "Something went wrong while getting redirects!");
    }
};

// ადმინი: ყველა, გამორთულებთან ერთად
const getAllRedirects = async (req, res) => {
    try {
        return res.status(200).send(await Redirect.find().sort({ createdAt: -1 }));
    } catch (error) {
        return sendError(res, error, "Something went wrong while getting redirects!");
    }
};

const createRedirect = async (req, res) => {
    try {
        const from = normalizeFrom(req.body?.from);
        const to = cleanTo(req.body?.to);
        const type = cleanType(req.body?.type);
        await assertNoLoop(from, to);

        const created = await Redirect.create({ from, to, type, active: req.body?.active !== false });
        return res.status(201).send(created);
    } catch (error) {
        if (error && error.code === 11000) return res.status(409).send("A redirect from this URL already exists.");
        return sendError(res, error, "Something went wrong while creating the redirect!");
    }
};

const updateRedirect = async (req, res) => {
    try {
        const { _id } = req.body || {};
        if (!_id) return res.status(400).send("_id is required.");

        const from = normalizeFrom(req.body.from);
        const to = cleanTo(req.body.to);
        const type = cleanType(req.body.type);
        await assertNoLoop(from, to, _id);

        const updated = await Redirect.findByIdAndUpdate(
            _id,
            { from, to, type, active: req.body.active !== false },
            { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).send("Redirect not found.");

        return res.status(200).send(updated);
    } catch (error) {
        if (error && error.code === 11000) return res.status(409).send("A redirect from this URL already exists.");
        return sendError(res, error, "Something went wrong while updating the redirect!");
    }
};

const deleteRedirect = async (req, res) => {
    try {
        const { _id } = req.body || {};
        if (!_id) return res.status(400).send("_id is required.");

        const deleted = await Redirect.findByIdAndDelete(_id);
        if (!deleted) return res.status(404).send("Redirect not found.");

        return res.status(200).send({ message: "Redirect deleted", _id });
    } catch (error) {
        return sendError(res, error, "Something went wrong while deleting the redirect!");
    }
};

module.exports = { getActiveRedirects, getAllRedirects, createRedirect, updateRedirect, deleteRedirect };
