// ადმინის ყველა მოთხოვნა სესიის cookie-ს უნდა თან წაიღოს.
// httpOnly cookie JavaScript-ით არ იკითხება, ამიტომ credentials: 'include' აუცილებელია —
// მის გარეშე fetch cookie-ს სხვა origin-ზე არ აგზავნის და პასუხი 401 იქნება.
export default function adminFetch(url, options = {}) {
    return fetch(url, { ...options, credentials: "include" });
}
