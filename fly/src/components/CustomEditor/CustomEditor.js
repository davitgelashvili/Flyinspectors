'use client'

import RichEditor from '../RichEditor/RichEditor'

// ადმინის ყველა ფორმა (გვერდები, FAQ, hero, წესები და პირობები...) რედაქტორს ამ კომპონენტით იყენებს.
// ინტერფეისი უცვლელია: onChange(section, name, html). თვით რედაქტორი — RichEditor (TipTap).
const CustomEditor = ({ onChange, name, section, title, value }) => (
    <RichEditor
        title={title}
        value={value || ''}
        onChange={(html) => onChange?.(section, name, html)}
    />
)

export default CustomEditor
