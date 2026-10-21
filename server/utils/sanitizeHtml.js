const sanitizeHtml = require("sanitize-html");
const { LANGS } = require("./localized");

// ადმინის რედაქტორი (TipTap, fly/src/components/RichEditor) და HTML რეჟიმი აწარმოებს HTML-ს, რომელსაც საიტი
// dangerouslySetInnerHTML-ით ხატავს. შენახვისას ყველა თეგი, ატრიბუტი, class, id, style, script და მისამართის
// სქემა გადის — რაც ჩაწერეს, ის ინახება უცვლელად.
// <ins>/<del> — ძველი რედაქტორის (draft-js) ფორმატი, უკვე შენახული ტექსტი რომ ისევ კარგად გამოჩნდეს.
const options = {
    allowedTags: false,
    allowedAttributes: false,
    allowVulnerableTags: true,
    allowedSchemesAppliedToAttributes: [],
    transformTags: {
        // target="_blank" ლინკებზე opener-ის გაჟონვა არ უნდა მოხდეს
        a: (tagName, attribs) => ({
            tagName,
            attribs: attribs.target === "_blank" ? { ...attribs, rel: "noopener noreferrer" } : attribs,
        }),
    },
};

const clean = (html) => sanitizeHtml(String(html ?? ""), options);

// body-ს ორენოვან რედაქტორის ველს ასუფთავებს: { en, ka } → გასუფთავებული HTML.
// არგადმოცემული ენა ხელუხლებელი რჩება (ნაწილობრივი განახლება არ უნდა გააცარიელოს).
// გვერდებიც და ბლოგის სტატიებიც ამას იყენებენ — ლოგიკა ერთ ადგილას რომ იყოს.
const sanitizeRichField = (body, field = "content") => {
    const value = body && body[field];
    if (!value || typeof value !== "object") return { ...body };

    return {
        ...body,
        [field]: Object.fromEntries(
            LANGS.filter((lang) => value[lang] !== undefined)
                .map((lang) => [lang, clean(value[lang])])
        ),
    };
};

module.exports = { sanitizeHtml: clean, sanitizeRichField };
