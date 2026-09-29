'use client'

import RichForm from '../RichForm/RichForm'
import translations from '../../Common/Slider/Slider.module'

const FIELDS = [
    { name: 'title', label: 'სათაური', placeholder: 'მაგ. ფრენის კომპენსაცია' },
    { name: 'accent', label: 'სათაურის ნარინჯისფერი ნაწილი', placeholder: 'მაგ. 600 ევრომდე' },
    { name: 'text', label: 'ტექსტი', editor: true },
]

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// ბაზა ცარიელია → საიტზე ახლა თარგმანის ფაილის ტექსტი ჩანს. ადმინშიც ის ვაჩვენოთ.
function getDefaults() {
    const { ka, en } = translations
    const pick = (t) => ({ title: t.SliderHero.title, accent: t.SliderHero.accent, text: `<p>${escapeHtml(t.SliderHero.sub)}</p>` })
    const k = pick(ka)
    const e = pick(en)

    return Object.fromEntries(
        FIELDS.map(({ name }) => [name, { ka: k[name], en: e[name] }])
    )
}

export default function HeroForm() {
    return (
        <RichForm
            heading="მთავარი გვერდის ტექსტი"
            endpoint="hero"
            fields={FIELDS}
            getDefaults={getDefaults}
        />
    )
}
