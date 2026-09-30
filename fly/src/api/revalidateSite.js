// ადმინში შენახვის შემდეგ საიტის კეშს აუქმებს, რომ ცვლილება მაშინვე გამოჩნდეს.
// შეცდომა შენახვას არ აფუჭებს: ტექსტი ბაზაშია და საიტზე მაქსიმუმ 60 წამში მაინც გამოჩნდება.
export default async function revalidateSite(tag) {
    try {
        await fetch('/adminpanel/revalidate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ tag }),
        })
    } catch {
        // ქსელის შეცდომა — უგულებელვყოფთ
    }
}
