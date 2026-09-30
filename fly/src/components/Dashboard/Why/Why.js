'use client'

import RichForm from '../RichForm/RichForm'

const FIELDS = [
    { name: 'title', label: 'სათაური', placeholder: 'მაგ. რატომ Flyinspectors?' },
    { name: 'text', label: 'ტექსტი', editor: true },
]

export default function WhyForm() {
    return (
        <RichForm
            heading="რატომ ჩვენ (მთავარი გვერდი)"
            endpoint="why"
            fields={FIELDS}
        />
    )
}
