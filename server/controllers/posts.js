const Post = require("../jsonModels/postModal");
const { sendError } = require("../utils/body");
const { sanitizeRichField } = require("../utils/sanitizeHtml");

const DEFAULT_LIMIT = 9;
const MAX_LIMIT = 100;

// საჯარო: სია. ნაგულისხმევად ყველა გამოქვეყნებული (sitemap-ს სრული სია სჭირდება),
// ?page=2 — გვერდებად დაყოფილი, ?all=true — ადმინს, გამოუქვეყნებლებთან ერთად.
// პასუხის ფორმა ყოველთვის ერთია: { items, total, page, pages }.
const getPosts = async (req, res) => {
    try {
        const all = req.query.all === "true";
        const filter = all ? {} : { published: true };

        const paged = req.query.page !== undefined;
        const limit = paged
            ? Math.min(Math.max(parseInt(req.query.limit, 10) || DEFAULT_LIMIT, 1), MAX_LIMIT)
            : 0;
        const total = await Post.countDocuments(filter);
        const pages = limit ? Math.max(Math.ceil(total / limit), 1) : 1;
        // დიაპაზონს გარეთ გასული გვერდი ბოლო გვერდად ითვლება — ცარიელ სიას არ ვაბრუნებთ
        const page = limit ? Math.min(Math.max(parseInt(req.query.page, 10) || 1, 1), pages) : 1;

        const query = Post.find(filter).sort({ publishedAt: -1, createdAt: -1 });
        if (limit) query.skip((page - 1) * limit).limit(limit);

        return res.status(200).send({ items: await query, total, page, pages });
    } catch (error) {
        return sendError(res, error, "Something went wrong while getting posts!");
    }
};

const getPostBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const post = await Post.findOne({ slug: String(slug).toLowerCase().trim() });
        if (!post) return res.status(404).send("Post not found.");

        return res.status(200).send(post);
    } catch (error) {
        return sendError(res, error, "Something went wrong while getting the post!");
    }
};

const createPost = async (req, res) => {
    try {
        const created = await Post.create(sanitizeRichField(req.body));
        return res.status(201).send(created);
    } catch (error) {
        if (error && error.code === 11000) {
            return res.status(409).send("A post with this link already exists.");
        }
        return sendError(res, error, "Something went wrong while creating the post!");
    }
};

const updatePost = async (req, res) => {
    try {
        // _id საძიებო გასაღებია — განახლებაში არ უნდა მოხვდეს
        const { _id, ...updates } = sanitizeRichField(req.body);
        if (!_id) return res.status(400).send("_id is required.");

        const updated = await Post.findByIdAndUpdate(_id, updates, {
            new: true,
            runValidators: true,
        });

        if (!updated) return res.status(404).send("Post not found.");

        return res.status(200).send(updated);
    } catch (error) {
        if (error && error.code === 11000) {
            return res.status(409).send("A post with this link already exists.");
        }
        return sendError(res, error, "Something went wrong while updating the post!");
    }
};

const deletePost = async (req, res) => {
    try {
        const { _id } = req.body;
        if (!_id) return res.status(400).send("_id is required.");

        const deleted = await Post.findByIdAndDelete(_id);
        if (!deleted) return res.status(404).send("Post not found.");

        return res.status(200).send({ message: "Post deleted", _id });
    } catch (error) {
        return sendError(res, error, "Something went wrong while deleting the post!");
    }
};

module.exports = { getPosts, getPostBySlug, createPost, updatePost, deletePost };
