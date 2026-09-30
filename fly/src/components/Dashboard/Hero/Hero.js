'use client'

import RichForm from '../RichForm/RichForm'

const FIELDS = [
    { name: 'title', label: 'სათაური', placeholder: 'მაგ. ფრენის კომპენსაცია' },
    { name: 'accent', label: 'სათაურის ნარინჯისფერი ნაწილი', placeholder: 'მაგ. 600 ევრომდე' },
    { name: 'text', label: 'ტექსტი', editor: true },
]

export default function HeroForm() {
    return (
        <RichForm
            heading="მთავარი გვერდის ტექსტი"
            endpoint="hero"
            fields={FIELDS}
        />
    )
}
