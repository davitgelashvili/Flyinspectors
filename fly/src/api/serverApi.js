import { apiTag } from './tags';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// ბაზის მიუწვდომლობისას გვერდი მაინც უნდა აიგოს, ამიტომ null/[] ბრუნდება throw-ის ნაცვლად.
// შედეგი 60 წამით იკეშება; ადმინში შენახვისას კეში ტეგით მაშინვე უქმდება
// (app/adminpanel/revalidate/route.js), ამიტომ ცვლილება საიტზე მყისიერად ჩანს.
// tag — კეშის ტეგი (ნაგულისხმევად path); ერთი რესურსის სხვადასხვა მისამართს (მაგ. /faq და
// /faq?home=true) საერთო ტეგი აქვს, რომ ადმინის შენახვამ ორივე ერთად გააუქმოს.
async function getJson(path, fallback, tag = path) {
    try {
        const res = await fetch(`${API_BASE}${path}`, { next: { revalidate: 60, tags: [apiTag(tag)] } });
        if (!res.ok) return fallback;
        return await res.json();
    } catch {
        return fallback;
    }
}

export const getRates = () => getJson('/rate', []);
export const getHero = () => getJson('/hero', null);
export const getOptions = () => getJson('/options', null);
export const getHow = () => getJson('/how', null);
export const getWhy = () => getJson('/why', null);

// "წესები და პირობები" (ადმინი → წესები და პირობები)
export const getTerms = () => getJson('/terms', null);

// ოფისები: ქვეყანა, ტელეფონი, ელფოსტა, მისამართი (ადმინი → საკონტაქტო)
export const getOffices = () => getJson('/offices', null);

// ყველა გვერდის მეტა ტეგები (ადმინი → მეტა თეგები)
export const getMeta = () => getJson('/meta', []);

// ხშირად დასმული კითხვები: ყველა (FAQ გვერდი) ან მხოლოდ მთავარზე მონიშნულები
export const getFaqs = ({ home = false } = {}) =>
    getJson(home ? '/faq?home=true' : '/faq', [], '/faq');

export const getPages = () => getJson('/pages', []);

export async function getPage(slug) {
    // ტეგი საერთოა /pages-თან: ადმინში შენახვა ფუტერის სიასაც და თვით გვერდსაც ერთად ანახლებს
    return getJson(`/pages/${encodeURIComponent(slug)}`, null, '/pages');
}
