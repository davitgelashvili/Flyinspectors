'use client'

import RichForm from '../RichForm/RichForm'

const FIELDS = [
    { name: 'title', label: 'სათაური', placeholder: 'მაგ. წესები და პირობები' },
    { name: 'text', label: 'ტექსტი', editor: true },
]

export default function TermsForm() {
    return (
        <RichForm
            heading="წესები და პირობები"
            endpoint="terms"
            fields={FIELDS}
        />
    )
}
