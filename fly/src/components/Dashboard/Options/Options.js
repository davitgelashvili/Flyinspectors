'use client'

import ListForm from '../ListForm/ListForm'

export default function OptionsForm() {
    return (
        <ListForm
            heading="კომპენსაციის ბარათები (მთავარი გვერდი)"
            endpoint="options"
            cardLabel="ბარათი"
            addLabel="+ ბარათის დამატება"
            titlePlaceholder="მაგ. გეკუთვნით თუ არა კომპენსაცია?"
        />
    )
}
