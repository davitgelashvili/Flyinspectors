const sanitizeHtml = require("sanitize-html");

// ადმინის რედაქტორი (TipTap, fly/src/components/RichEditor) HTML-ს აგენერირებს, რომელსაც საიტი
// dangerouslySetInnerHTML-ით ხატავს ყველა ვიზიტორისთვის. ამიტომ შენახვისას ვტოვებთ მხოლოდ იმ თეგებს,
// ატრიბუტებსა და სტილებს, რომლებსაც რედაქტორი აწარმოებს. ყველაფერი დანარჩენი (script, onclick,
// javascript:, უცხო iframe და ა.შ.) იჭრება. <ins>/<del> — ძველი რედაქტორის (draft-js) ფორმატი, უკვე
// შენახული ტექსტი რომ ისევ კარგად გამოჩნდეს.
const COLOR = [/^#[0-9a-f]{3,8}$/i, /^rgba?\([\d\s,.%]+\)$/i];

const options = {
    allowedTags: [
        "p", "br", "strong", "em", "u", "s", "ins", "del", "sub", "sup", "code", "mark",
        "h1", "h2", "h3", "h4", "h5", "h6",
        "ul", "ol", "li", "blockquote", "pre", "hr", "a", "span",
        "img", "iframe", "div",
        "table", "thead", "tbody", "tfoot", "tr", "th", "td", "caption",
    ],
    allowedAttributes: {
        a: ["href", "target", "rel"],
        // data-align / data-size — სურათის გასწორება და ზომა (მხოლოდ დაშვებული მნიშვნელობები)
        img: [
            "src", "alt", "title", "width", "height",
            { name: "data-align", values: ["left", "right", "center"] },
            { name: "data-size", values: ["25", "33", "50", "75", "100"] },
        ],
        iframe: ["src", "width", "height", "allowfullscreen", "frameborder"],
        div: [
            "data-youtube-video", // TipTap-ის YouTube ბლოკის გარსი
            // ორი სვეტი: გარსი, თითო სვეტი და მარცხენა სვეტის წილი (მხოლოდ დაშვებული მნიშვნელობები)
            { name: "data-columns", values: ["2"] },
            { name: "data-column", values: [""] },
            { name: "data-ratio", values: ["33", "50", "67"] },
        ],
        th: ["colspan", "rowspan", "style"],
        td: ["colspan", "rowspan", "style"],
        p: ["style"],
        span: ["style"],
        mark: ["style"],
        li: ["style"],
        h1: ["style"], h2: ["style"], h3: ["style"],
        h4: ["style"], h5: ["style"], h6: ["style"],
        code: ["class"],
    },
    // კოდის ბლოკის ენა: <code class="language-js">
    allowedClasses: { code: ["language-*"] },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    // სურათი მხოლოდ მისამართით; data: (base64) არ გადის — ბაზას ბერავს
    allowedSchemesByTag: { img: ["http", "https"] },
    // ვიდეოს ჩასმა მხოლოდ ამ სერვისებიდან
    allowedIframeHostnames: ["www.youtube.com", "www.youtube-nocookie.com", "player.vimeo.com"],
    allowedStyles: {
        "*": {
            color: COLOR,
            "background-color": COLOR,
            "text-align": [/^(left|right|center|justify)$/],
            "font-size": [/^\d+(\.\d+)?(px|em|rem|pt|%)$/],
            "font-family": [/^[\w\s,'"\-]+$/],
        },
    },
    // სურათი/iframe, რომელსაც დაშვებული src აღარ დარჩა (base64, უცხო ჰოსტი), სრულად ამოვარდეს
    exclusiveFilter: (frame) => (frame.tag === "img" || frame.tag === "iframe") && !frame.attribs.src,
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
