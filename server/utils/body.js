/** mongoose-ის ValidationError → 400, დანარჩენი → 500 */
function sendError(res, error, fallback) {
    if (error && (error.name === "ValidationError" || error.name === "CastError")) {
        return res.status(400).send(error.message);
    }
    console.error(error);
    return res.status(500).send(fallback);
}

module.exports = { sendError };
