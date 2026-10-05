const LANGS = ["en", "ka"];

const invalid = (message) => Object.assign(new Error(message), { name: "ValidationError" });

// { en, ka } → გასუფთავებული ობიექტი. ტექსტი უბრალოა (საიტი მას React-ით,
// ანუ escape-ით ხატავს), ამიტომ HTML-ის გასუფთავება არ სჭირდება.
// partial=true: მხოლოდ გადმოცემულ ენებს ვაბრუნებთ (არგადმოცემული არ უნდა გაცარიელდეს)
const cleanLocalized = (value, limit, label, partial = false) => {
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
        throw invalid(`${label} must be an object like { en, ka }`);
    }

    const result = {};
    for (const lang of LANGS) {
        if (partial && value[lang] === undefined) continue;
        const text = String(value[lang] ?? "").trim();
        if (text.length > limit) throw invalid(`${label} "${lang}" is too long (max ${limit} characters).`);
        result[lang] = text;
    }
    return result;
};

module.exports = { LANGS, invalid, cleanLocalized };
