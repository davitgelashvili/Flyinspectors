'use client'

import RichForm from '../RichForm/RichForm'
import content from '../../WhyWe/WhyWe.content'

const FIELDS = [
    { name: 'title', label: 'სათაური', placeholder: 'მაგ. რატომ Flyinspectors?' },
    { name: 'text', label: 'ტექსტი', editor: true },
]

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// საიტის ნაგულისხმევის იდენტური HTML (ბოლო აბზაცი გამუქებულია)
const toHtml = (paragraphs) =>
    paragraphs
        .map((p, i) => i === paragraphs.length - 1
            ? `<p><strong>${escapeHtml(p)}</strong></p>`
            : `<p>${escapeHtml(p)}</p>`)
        .join('')

function getDefaults() {
    const { ka, en } = content
    return {
        title: { ka: ka.title, en: en.title },
        text: { ka: toHtml(ka.paragraphs), en: toHtml(en.paragraphs) },
    }
}

export default function WhyForm() {
    return (
        <RichForm
            heading="რატომ ჩვენ (მთავარი გვერდი)"
            endpoint="why"
            fields={FIELDS}
            getDefaults={getDefaults}
        />
    )
}
