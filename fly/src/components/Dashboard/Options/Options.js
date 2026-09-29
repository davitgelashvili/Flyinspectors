'use client'

import ListForm from '../ListForm/ListForm'
import translations from '../../OptionsSection/opensection.module'

const DEFAULT_KEYS = [
    'delay',
    'compensation',
    'missedconnectioncompensation',
    'overbookingcompensation',
    'compensationfordeniedboarding',
    'delayedbaggagecompensation',
]

// ბაზა ცარიელია → საიტზე ახლა თარგმანის ფაილის ტექსტები ჩანს. ადმინშიც ისინი ვაჩვენოთ.
function getDefaults() {
    const { ka, en } = translations
    return {
        sectionTitle: { ka: ka.opensection.sectionTitle, en: en.opensection.sectionTitle },
        items: DEFAULT_KEYS.map((key) => ({
            title: { ka: ka.opensection[key].title, en: en.opensection[key].title },
            desc: { ka: ka.opensection[key].desc, en: en.opensection[key].desc },
        })),
    }
}

export default function OptionsForm() {
    return (
        <ListForm
            heading="კომპენსაციის ბარათები (მთავარი გვერდი)"
            endpoint="options"
            cardLabel="ბარათი"
            addLabel="+ ბარათის დამატება"
            titlePlaceholder="მაგ. გეკუთვნით თუ არა კომპენსაცია?"
            getDefaults={getDefaults}
        />
    )
}
