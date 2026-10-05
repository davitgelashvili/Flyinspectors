import { LOCALES } from "@/i18n/locales";

// ქვეყნის სახელი და მისამართი საკუთარი სახელებია, ამიტომ ამ ენაზე შეუვსებელს ვანაცვლებთ
// მეორე ენის ტექსტით (ტელეფონი და ელფოსტა ისედაც ენისგან დამოუკიდებელია)
const localized = (value, locale) => {
    const other = LOCALES.find((l) => l !== locale);
    return value?.[locale]?.trim() || value?.[other]?.trim() || "";
};

/**
 * ბაზიდან მოსული ოფისები → საიტისთვის მზა სია (ამ ენაზე).
 * ოფისი, რომელსაც ტელეფონი, ელფოსტა და მისამართი არცერთი არ აქვს, არ ჩანს.
 */
export function normalizeOffices(offices, locale) {
    return (Array.isArray(offices) ? offices : [])
        .map((office) => ({
            key: office._id,
            country: localized(office.country, locale),
            phone: office.phone?.trim() || "",
            email: office.email?.trim() || "",
            address: localized(office.address, locale),
        }))
        .filter((office) => office.phone || office.email || office.address);
}

// "+995 593 00 03 94" → "tel:+995593000394"
export const telHref = (phone) => `tel:${phone.replace(/[^\d+]/g, "")}`;
