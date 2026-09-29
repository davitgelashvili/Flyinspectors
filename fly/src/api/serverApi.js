const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// ბაზის მიუწვდომლობისას გვერდი მაინც უნდა აიგოს, ამიტომ null/[] ბრუნდება throw-ის ნაცვლად
async function getJson(path, fallback) {
    try {
        const res = await fetch(`${API_BASE}${path}`, { next: { revalidate: 60 } });
        if (!res.ok) return fallback;
        return await res.json();
    } catch {
        return fallback;
    }
}

export const getServices = () => getJson('/services', []);
export const getConditions = () => getJson('/conditions', []);
export const getRates = () => getJson('/rate', []);
export const getHero = () => getJson('/hero', null);
export const getOptions = () => getJson('/options', null);
export const getHow = () => getJson('/how', null);
export const getWhy = () => getJson('/why', null);

export const getPages = () => getJson('/pages', []);

export async function getPage(slug) {
    return getJson(`/pages/${encodeURIComponent(slug)}`, null);
}

export async function getContactList() {
    const data = await getJson('/contactlist', []);
    return Array.isArray(data) ? data[0] : null;
}
