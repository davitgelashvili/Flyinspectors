'use client'

import ListForm from '../ListForm/ListForm'

export default function HowForm() {
    return (
        <ListForm
            heading="როგორ მუშაობს (მთავარი გვერდი)"
            endpoint="how"
            cardLabel="საფეხური"
            addLabel="+ საფეხურის დამატება"
            titlePlaceholder="მაგ. როგორ მუშაობს"
        />
    )
}
