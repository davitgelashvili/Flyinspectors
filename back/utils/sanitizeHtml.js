const sanitizeHtml = require("sanitize-html");

// ადმინის რედაქტორი (react-draft-wysiwyg → draftjs-to-html) HTML-ს აგენერირებს,
// რომელსაც საიტი dangerouslySetInnerHTML-ით ხატავს. ამიტომ შენახვისას ვტოვებთ
// მხოლოდ იმ თეგებს და სტილებს, რომლებსაც რედაქტორი თვითონ აწარმოებს.
const options = {
    allowedTags: [
        "p", "br", "strong", "em", "ins", "del", "sub", "sup", "code",
        "h1", "h2", "h3", "h4", "h5", "h6",
        "ul", "ol", "li", "blockquote", "pre", "a", "span",
    ],
    allowedAttributes: {
        a: ["href", "target", "rel"],
        p: ["style"],
        span: ["style"],
        li: ["style"],
        h1: ["style"], h2: ["style"], h3: ["style"],
        h4: ["style"], h5: ["style"], h6: ["style"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedStyles: {
        "*": {
            color: [/^#[0-9a-f]{3,8}$/i, /^rgba?\([\d\s,.%]+\)$/i],
            "background-color": [/^#[0-9a-f]{3,8}$/i, /^rgba?\([\d\s,.%]+\)$/i],
            "text-align": [/^(left|right|center|justify)$/],
            "font-size": [/^\d+(\.\d+)?(px|em|rem|pt|%)$/],
        },
    },
    transformTags: {
        // გვერდს ერთი <h1> უნდა ჰქონდეს (SEO) და ის საიტის თავისი სათაურია.
        // რედაქტორში ჩასმული H1 საიტზე H2 გახდება.
        h1: "h2",
        // target="_blank" ლინკებზე opener-ის გაჟონვა არ უნდა მოხდეს
        a: (tagName, attribs) => ({
            tagName,
            attribs: attribs.target === "_blank" ? { ...attribs, rel: "noopener noreferrer" } : attribs,
        }),
    },
};

const clean = (html) => sanitizeHtml(String(html ?? ""), options);

module.exports = { sanitizeHtml: clean };
