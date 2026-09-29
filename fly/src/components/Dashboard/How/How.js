'use client'

import ListForm from '../ListForm/ListForm'
import adminFetch from '../../../api/adminFetch'
import translations from '../../ServicesOptions/ServicesOptions.module'

function getDefaults() {
    const { ka, en } = translations
    return {
        sectionTitle: { ka: ka.title, en: en.title },
        items: ka.steps.map((step, i) => ({
            title: { ka: step.title, en: en.steps[i]?.title || '' },
            desc: { ka: step.desc, en: en.steps[i]?.desc || '' },
        })),
    }
}

// საიტზე ახლა ძველი "სერვისები" ჩანს (თუ ბაზაშია). ფორმა მათით დავიწყოთ,
// რომ პირველი შენახვისას არსებული ტექსტი არ დაიკარგოს.
async function getFallback() {
    const res = await adminFetch(`${process.env.NEXT_PUBLIC_API_URL}/services`)
    if (!res.ok) return null

    const services = await res.json()
    if (!Array.isArray(services) || !services.length) return null

    return {
        sectionTitle: getDefaults().sectionTitle,
        items: services.map((s) => ({ title: s.title, desc: s.description })),
    }
}

export default function HowForm() {
    return (
        <ListForm
            heading="როგორ მუშაობს (მთავარი გვერდი)"
            endpoint="how"
            cardLabel="საფეხური"
            addLabel="+ საფეხურის დამატება"
            titlePlaceholder="მაგ. როგორ მუშაობს"
            getDefaults={getDefaults}
            getFallback={getFallback}
        />
    )
}
