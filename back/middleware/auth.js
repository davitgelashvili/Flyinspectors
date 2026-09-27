const jwt = require("jsonwebtoken");

const COOKIE_NAME = "fi_session";
const MAX_AGE_MS = 12 * 60 * 60 * 1000;

function signSession(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "12h" });
}

function cookieOptions() {
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        // API ქვედომენზე გადასვლისას: COOKIE_DOMAIN=.flyinspectors.com
        domain: process.env.COOKIE_DOMAIN || undefined,
        path: "/",
    };
}

function setSessionCookie(res, token) {
    res.cookie(COOKIE_NAME, token, { ...cookieOptions(), maxAge: MAX_AGE_MS });
}

function clearSessionCookie(res) {
    res.clearCookie(COOKIE_NAME, cookieOptions());
}

function requireAuth(req, res, next) {
    const token = req.cookies && req.cookies[COOKIE_NAME];
    if (!token) return res.status(401).send("Authentication required");

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        return next();
    } catch {
        return res.status(401).send("Invalid or expired session");
    }
}

// admin ყველგან გადის — ცალკე ჩამოთვლა არ სჭირდება
function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user) return res.status(401).send("Authentication required");
        if (req.user.role === "admin" || roles.includes(req.user.role)) return next();
        return res.status(403).send("Insufficient permissions");
    };
}

module.exports = {
    COOKIE_NAME,
    signSession,
    setSessionCookie,
    clearSessionCookie,
    requireAuth,
    requireRole,
};
