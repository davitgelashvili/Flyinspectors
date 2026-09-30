'use client'

import { useState } from 'react'
import { uploadToCloudinary } from '@/utils/cloudinary'
import styles from './RichEditor.module.scss'

const BLOCKS = [
  { value: 'p', label: 'აბზაცი' },
  { value: '2', label: 'სათაური 2' },
  { value: '3', label: 'სათაური 3' },
  { value: '4', label: 'სათაური 4' },
  { value: '5', label: 'სათაური 5' },
  { value: '6', label: 'სათაური 6' },
]

const FONTS = [
  { value: '', label: 'შრიფტი' },
  { value: 'FiraGO, sans-serif', label: 'FiraGO' },
  { value: 'Arial, Helvetica, sans-serif', label: 'Arial' },
  { value: 'Verdana, Geneva, sans-serif', label: 'Verdana' },
  { value: 'Trebuchet MS, sans-serif', label: 'Trebuchet' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: 'Times New Roman, Times, serif', label: 'Times New Roman' },
  { value: 'Courier New, monospace', label: 'Courier New' },
]

// სურათის სიგანე კონტეინერის პროცენტებში (ბექის სანიტაიზერიც ამ მნიშვნელობებს უშვებს)
const IMAGE_SIZES = [
  { value: null, label: 'ორიგინალი' },
  { value: '25', label: '25%' },
  { value: '33', label: '33%' },
  { value: '50', label: '50%' },
  { value: '75', label: '75%' },
  { value: '100', label: '100%' },
]

// სვეტების პროპორცია: მარცხენა სვეტის წილი პროცენტებში (ბექის სანიტაიზერიც ამ მნიშვნელობებს უშვებს)
const COLUMN_RATIOS = [
  { value: null, label: '50 / 50' },
  { value: '33', label: '33 / 67' },
  { value: '67', label: '67 / 33' },
]

const SIZES = ['', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '40px', '48px']

const EMOJIS = [
  '😀', '😃', '😄', '😁', '😊', '🙂', '😉', '😍', '🥰', '😘', '😎', '🤩', '🥳', '😇', '🤗', '🤔',
  '😐', '😢', '😭', '😡', '😱', '🙏', '👍', '👎', '👏', '🙌', '💪', '✌️', '👌', '👋', '🤝', '❤️',
  '💛', '💙', '💚', '🔥', '⭐', '✨', '🎉', '🎁', '✅', '❌', '⚠️', '❗', '❓', '💡', '📌', '📎',
  '✈️', '🛫', '🛬', '🧳', '🌍', '🏨', '🚕', '🕒', '📅', '📞', '✉️', '💶', '💰', '📄', '🔒', '🔎',
]

// სრული მისამართი (https://...), mailto:, tel: ან საიტის შიგა ბმული (/ka/...). დომენი სქემის
// გარეშე ("flyinspectors.com") https-ით ივსება; javascript: და მისთანები არ გადის.
function normalizeUrl(input) {
  const url = input.trim()
  if (!url) return ''
  if (/^(https?:\/\/|mailto:|tel:)/i.test(url) || url.startsWith('/') || url.startsWith('#')) return url
  if (/^[a-z][a-z0-9+.-]*:/i.test(url)) return '' // უცნობი სქემა (javascript: და ა.შ.)
  return `https://${url}`
}

function Btn({ onClick, active, disabled, title, children, wide }) {
  return (
    <button
      type="button"
      className={`${styles.btn} ${active ? styles.btn__active : ''} ${wide ? styles.btn__wide : ''}`}
      onMouseDown={(e) => e.preventDefault()} // მონიშვნა არ დაიკარგოს
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      aria-pressed={active ? true : undefined}
    >
      {children}
    </button>
  )
}

const Sep = () => <span className={styles.sep} aria-hidden="true" />

export default function Toolbar({ editor, source, onToggleSource, fullscreen, onToggleFullscreen }) {
  const [panel, setPanel] = useState(null) // 'link' | 'image' | 'video' | 'emoji' | null
  const [linkUrl, setLinkUrl] = useState('')
  const [linkBlank, setLinkBlank] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [imageAlt, setImageAlt] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')

  if (!editor) return null

  const chain = () => editor.chain().focus()
  const disabled = source // HTML რეჟიმში ფორმატირების ღილაკები გამორთულია
  const inTable = editor.isActive('table')
  const inImage = editor.isActive('image')
  const inColumns = editor.isActive('columns')
  const columnsRatio = editor.getAttributes('columns').ratio || null
  const imageAttrs = editor.getAttributes('image')
  const textStyle = editor.getAttributes('textStyle')

  const closePanel = () => { setPanel(null); setNotice('') }
  const togglePanel = (name) => {
    setNotice('')
    setPanel((current) => (current === name ? null : name))
  }

  const openLink = () => {
    const attrs = editor.getAttributes('link')
    setLinkUrl(attrs.href || '')
    setLinkBlank(attrs.target === '_blank')
    togglePanel('link')
  }

  const applyLink = () => {
    const href = normalizeUrl(linkUrl)
    if (!href) { setNotice('მიუთითეთ სწორი მისამართი (https://..., mailto:, tel: ან /გვერდი)'); return }
    chain().extendMarkRange('link').setLink({ href, target: linkBlank ? '_blank' : null }).run()
    closePanel()
  }

  const removeLink = () => {
    chain().extendMarkRange('link').unsetLink().run()
    closePanel()
  }

  const insertImage = (src) => {
    // თავიდანვე მცურავი (მარცხნივ) და 33%-იანია, რომ ტექსტი მის გვერდით, ზემოდან იწყებოდეს;
    // სხვა განლაგება ჩასმის შემდეგ სურათის პანელიდან აირჩევა
    chain().setImage({ src, alt: imageAlt.trim(), align: 'left', size: '33' }).run()
    // ჩასმული სურათი მოვნიშნოთ: გასწორების/ზომის ღილაკები მაშინვე გამოჩნდება
    const { from } = editor.state.selection
    if (editor.state.doc.nodeAt(from - 1)?.type.name === 'image') editor.commands.setNodeSelection(from - 1)
    setImageUrl('')
    setImageAlt('')
    closePanel()
  }

  const applyImageUrl = () => {
    const src = normalizeUrl(imageUrl)
    if (!/^https?:\/\//i.test(src)) { setNotice('მიუთითეთ სურათის სრული მისამართი (https://...)'); return }
    insertImage(src)
  }

  const uploadImage = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setBusy(true)
    setNotice('')
    try {
      insertImage(await uploadToCloudinary(file))
    } catch (e) {
      setNotice(e.message || 'ატვირთვა ვერ მოხერხდა')
    } finally {
      setBusy(false)
    }
  }

  const applyVideo = () => {
    // setYoutubeVideo არასწორ (არა-YouTube) ბმულზე false-ს აბრუნებს და არაფერს ჩასვამს
    const inserted = chain().setYoutubeVideo({ src: videoUrl.trim() }).run()
    if (!inserted) { setNotice('მიუთითეთ YouTube-ის ბმული'); return }
    setVideoUrl('')
    closePanel()
  }

  // ატრიბუტის შეცვლისას ProseMirror მონიშნულ სურათს ტექსტურ კურსორად აქცევს (სურათი "იცვლება"),
  // ამიტომ გასწორების/ზომის რიგი გაქრებოდა. შეცვლის შემდეგ სურათს თავიდან ვნიშნავთ.
  const setImageAttrs = (attrs, { focus = true } = {}) => {
    const position = editor.state.selection.from
    const run = focus ? chain() : editor.chain()
    run.updateAttributes('image', attrs).run()
    if (editor.state.doc.nodeAt(position)?.type.name === 'image') editor.commands.setNodeSelection(position)
  }

  const blockValue = [2, 3, 4, 5, 6].find((level) => editor.isActive('heading', { level }))?.toString() || 'p'
  const setBlock = (value) => {
    if (value === 'p') chain().setParagraph().run()
    else chain().setHeading({ level: Number(value) }).run()
  }

  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbar__row}>
        <Btn title="გაუქმება (Ctrl+Z)" onClick={() => chain().undo().run()} disabled={disabled || !editor.can().undo()}>↶</Btn>
        <Btn title="დაბრუნება (Ctrl+Y)" onClick={() => chain().redo().run()} disabled={disabled || !editor.can().redo()}>↷</Btn>
        <Sep />

        <select className={styles.select} value={blockValue} disabled={disabled} title="ბლოკის ტიპი"
          onChange={(e) => setBlock(e.target.value)}>
          {BLOCKS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
        </select>
        <select className={styles.select} value={textStyle.fontFamily || ''} disabled={disabled} title="შრიფტი"
          onChange={(e) => (e.target.value ? chain().setFontFamily(e.target.value).run() : chain().unsetFontFamily().run())}>
          {FONTS.map((f) => <option key={f.label} value={f.value}>{f.label}</option>)}
        </select>
        <select className={`${styles.select} ${styles.select__narrow}`} value={textStyle.fontSize || ''} disabled={disabled} title="შრიფტის ზომა"
          onChange={(e) => (e.target.value ? chain().setFontSize(e.target.value).run() : chain().unsetFontSize().run())}>
          {SIZES.map((s) => <option key={s} value={s}>{s ? s.replace('px', '') : 'ზომა'}</option>)}
        </select>
        <Sep />

        <Btn title="მსხვილი (Ctrl+B)" active={editor.isActive('bold')} disabled={disabled} onClick={() => chain().toggleBold().run()}><b>B</b></Btn>
        <Btn title="დახრილი (Ctrl+I)" active={editor.isActive('italic')} disabled={disabled} onClick={() => chain().toggleItalic().run()}><i>I</i></Btn>
        <Btn title="ხაზგასმული (Ctrl+U)" active={editor.isActive('underline')} disabled={disabled} onClick={() => chain().toggleUnderline().run()}><u>U</u></Btn>
        <Btn title="გადახაზული" active={editor.isActive('strike')} disabled={disabled} onClick={() => chain().toggleStrike().run()}><s>S</s></Btn>
        <Btn title="კოდი (ტექსტში)" active={editor.isActive('code')} disabled={disabled} onClick={() => chain().toggleCode().run()}>{'</>'}</Btn>
        <Btn title="ზედა ინდექსი" active={editor.isActive('superscript')} disabled={disabled} onClick={() => chain().toggleSuperscript().run()}>x²</Btn>
        <Btn title="ქვედა ინდექსი" active={editor.isActive('subscript')} disabled={disabled} onClick={() => chain().toggleSubscript().run()}>x₂</Btn>
        <Sep />

        <label className={styles.color} title="ტექსტის ფერი">
          <span className={styles.color__label} style={{ borderBottomColor: textStyle.color || '#000000' }}>A</span>
          <input type="color" disabled={disabled} value={/^#[0-9a-f]{6}$/i.test(textStyle.color || '') ? textStyle.color : '#000000'}
            onChange={(e) => chain().setColor(e.target.value).run()} />
        </label>
        <Btn title="ტექსტის ფერის მოხსნა" disabled={disabled} onClick={() => chain().unsetColor().run()}>A✕</Btn>
        <label className={styles.color} title="მონიშვნის (ფონის) ფერი">
          <span className={`${styles.color__label} ${styles.color__highlight}`}
            style={{ backgroundColor: editor.getAttributes('highlight').color || '#fff59d' }}>ab</span>
          <input type="color" disabled={disabled} value={/^#[0-9a-f]{6}$/i.test(editor.getAttributes('highlight').color || '') ? editor.getAttributes('highlight').color : '#fff59d'}
            onChange={(e) => chain().setHighlight({ color: e.target.value }).run()} />
        </label>
        <Btn title="მონიშვნის მოხსნა" disabled={disabled} active={editor.isActive('highlight')} onClick={() => chain().unsetHighlight().run()}>ab✕</Btn>
      </div>

      <div className={styles.toolbar__row}>
        <Btn title="მარცხნივ" active={editor.isActive({ textAlign: 'left' })} disabled={disabled} onClick={() => chain().setTextAlign('left').run()}>⬅</Btn>
        <Btn title="ცენტრში" active={editor.isActive({ textAlign: 'center' })} disabled={disabled} onClick={() => chain().setTextAlign('center').run()}>↔</Btn>
        <Btn title="მარჯვნივ" active={editor.isActive({ textAlign: 'right' })} disabled={disabled} onClick={() => chain().setTextAlign('right').run()}>➡</Btn>
        <Btn title="სრულად გასწორება" active={editor.isActive({ textAlign: 'justify' })} disabled={disabled} onClick={() => chain().setTextAlign('justify').run()}>☰</Btn>
        <Sep />

        <Btn title="სია (წერტილებით)" active={editor.isActive('bulletList')} disabled={disabled} onClick={() => chain().toggleBulletList().run()}>• სია</Btn>
        <Btn title="დანომრილი სია" active={editor.isActive('orderedList')} disabled={disabled} onClick={() => chain().toggleOrderedList().run()}>1. სია</Btn>
        <Btn title="შეწევის შემცირება" disabled={disabled || !editor.can().liftListItem('listItem')} onClick={() => chain().liftListItem('listItem').run()}>⇤</Btn>
        <Btn title="შეწევის გაზრდა" disabled={disabled || !editor.can().sinkListItem('listItem')} onClick={() => chain().sinkListItem('listItem').run()}>⇥</Btn>
        <Sep />

        <Btn title="ციტატა" active={editor.isActive('blockquote')} disabled={disabled} onClick={() => chain().toggleBlockquote().run()}>❝</Btn>
        <Btn title="კოდის ბლოკი" active={editor.isActive('codeBlock')} disabled={disabled} onClick={() => chain().toggleCodeBlock().run()}>{'{ }'}</Btn>
        <Btn title="ჰორიზონტალური ხაზი" disabled={disabled} onClick={() => chain().setHorizontalRule().run()}>―</Btn>
        <Btn title="გადატანა ახალ ხაზზე (Shift+Enter)" disabled={disabled} onClick={() => chain().setHardBreak().run()}>↵</Btn>
        <Sep />

        <Btn title="ბმული" active={editor.isActive('link') || panel === 'link'} disabled={disabled} onClick={openLink}>🔗</Btn>
        <Btn title="ბმულის მოხსნა" disabled={disabled || !editor.isActive('link')} onClick={removeLink}>🔗✕</Btn>
        <Btn title="სურათი" active={panel === 'image'} disabled={disabled} onClick={() => togglePanel('image')}>🖼</Btn>
        <Btn title="ვიდეო (YouTube)" active={panel === 'video'} disabled={disabled} onClick={() => togglePanel('video')}>▶</Btn>
        <Btn title="ცხრილის ჩასმა (3×3)" active={inTable} disabled={disabled} onClick={() => chain().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>▦ ცხრილი</Btn>
        <Btn title="ორი სვეტი: თითოეულში ნებისმიერი შიგთავსი (ტექსტი, ცხრილი, ვიდეო, სია...)" active={inColumns} disabled={disabled || inColumns} onClick={() => chain().insertColumns().run()}>▥ სვეტები</Btn>
        <Btn title="ემოჯი" active={panel === 'emoji'} disabled={disabled} onClick={() => togglePanel('emoji')}>😊</Btn>
        <Sep />

        <Btn title="ფორმატირების გასუფთავება" disabled={disabled} onClick={() => chain().unsetAllMarks().clearNodes().run()}>Tx</Btn>
        <Btn title="HTML კოდი" active={source} onClick={onToggleSource} wide>{'<HTML>'}</Btn>
        <Btn title={fullscreen ? 'სრულ ეკრანზე გასვლა' : 'სრული ეკრანი'} active={fullscreen} onClick={onToggleFullscreen}>{fullscreen ? '⤡' : '⤢'}</Btn>
      </div>

      {inTable && !source && (
        <div className={`${styles.toolbar__row} ${styles.toolbar__table}`}>
          <span className={styles.toolbar__label}>ცხრილი:</span>
          <Btn wide title="სვეტის დამატება მარცხნივ" onClick={() => chain().addColumnBefore().run()}>+ სვეტი ←</Btn>
          <Btn wide title="სვეტის დამატება მარჯვნივ" onClick={() => chain().addColumnAfter().run()}>+ სვეტი →</Btn>
          <Btn wide title="სვეტის წაშლა" onClick={() => chain().deleteColumn().run()}>− სვეტი</Btn>
          <Sep />
          <Btn wide title="სტრიქონის დამატება ზემოთ" onClick={() => chain().addRowBefore().run()}>+ სტრიქონი ↑</Btn>
          <Btn wide title="სტრიქონის დამატება ქვემოთ" onClick={() => chain().addRowAfter().run()}>+ სტრიქონი ↓</Btn>
          <Btn wide title="სტრიქონის წაშლა" onClick={() => chain().deleteRow().run()}>− სტრიქონი</Btn>
          <Sep />
          <Btn wide title="სათაურის სტრიქონი" onClick={() => chain().toggleHeaderRow().run()}>სათაური</Btn>
          <Btn wide title="უჯრების გაერთიანება" disabled={!editor.can().mergeCells()} onClick={() => chain().mergeCells().run()}>გაერთიანება</Btn>
          <Btn wide title="უჯრის გაყოფა" disabled={!editor.can().splitCell()} onClick={() => chain().splitCell().run()}>გაყოფა</Btn>
          <Btn wide title="ცხრილის წაშლა" onClick={() => chain().deleteTable().run()}>ცხრილის წაშლა</Btn>
        </div>
      )}

      {inColumns && !source && (
        <div className={`${styles.toolbar__row} ${styles.toolbar__table}`}>
          <span className={styles.toolbar__label}>სვეტები:</span>
          {COLUMN_RATIOS.map((ratio) => (
            <Btn key={ratio.label} wide title={`სვეტების პროპორცია: ${ratio.label}`} active={columnsRatio === ratio.value} onClick={() => chain().setColumnsRatio(ratio.value).run()}>
              {ratio.label}
            </Btn>
          ))}
          <Sep />
          <Btn wide title="სვეტების ადგილების გაცვლა" onClick={() => chain().swapColumns().run()}>⇄ გაცვლა</Btn>
          <Btn wide title="სვეტების მოხსნა: შიგთავსი ერთმანეთის მიყოლებით დარჩება" onClick={() => chain().unwrapColumns().run()}>სვეტების მოხსნა</Btn>
          <Btn wide title="სვეტებისა და მათი შიგთავსის წაშლა" onClick={() => chain().deleteColumns().run()}>წაშლა</Btn>
        </div>
      )}

      {inImage && !source && (
        <div className={`${styles.toolbar__row} ${styles.toolbar__table}`}>
          <span className={styles.toolbar__label}>სურათი:</span>
          <Btn wide title="მარცხნივ: ტექსტი სურათის მარჯვნივ დაიწერება" active={imageAttrs.align === 'left'} onClick={() => setImageAttrs({ align: 'left' })}>⬅ მარცხნივ</Btn>
          <Btn wide title="ცენტრში, ცალკე ხაზზე" active={imageAttrs.align === 'center'} onClick={() => setImageAttrs({ align: 'center' })}>▣ ცენტრში</Btn>
          <Btn wide title="მარჯვნივ: ტექსტი სურათის მარცხნივ დაიწერება" active={imageAttrs.align === 'right'} onClick={() => setImageAttrs({ align: 'right' })}>მარჯვნივ ➡</Btn>
          <Btn wide title="ტექსტში, გასწორების გარეშე" active={!imageAttrs.align} onClick={() => setImageAttrs({ align: null })}>ტექსტში</Btn>
          <Sep />
          {IMAGE_SIZES.map((size) => (
            <Btn key={size.label} title={`სურათის სიგანე: ${size.label}`} active={(imageAttrs.size || null) === size.value} onClick={() => setImageAttrs({ size: size.value })}>
              {size.label}
            </Btn>
          ))}
          <Sep />
          <input
            className={`${styles.panel__input} ${styles.panel__input_short}`}
            type="text"
            value={imageAttrs.alt || ''}
            placeholder="აღწერა (alt) — SEO-სთვის"
            aria-label="სურათის აღწერა (alt)"
            onChange={(e) => setImageAttrs({ alt: e.target.value }, { focus: false })}
          />
          <Btn wide title="სურათის წაშლა" onClick={() => chain().deleteSelection().run()}>წაშლა</Btn>
        </div>
      )}

      {panel && !source && (
        <div className={styles.panel}>
          {panel === 'link' && (
            <>
              <input className={styles.panel__input} type="text" value={linkUrl} autoFocus
                placeholder="https://example.com, mailto:..., tel:+995... ან /ka/about-us"
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); applyLink() } }} />
              <label className={styles.panel__check}>
                <input type="checkbox" checked={linkBlank} onChange={(e) => setLinkBlank(e.target.checked)} />
                ახალ ფანჯარაში
              </label>
              <button type="button" className={styles.panel__btn} onClick={applyLink}>დამატება</button>
            </>
          )}

          {panel === 'image' && (
            <>
              <label className={`${styles.panel__btn} ${busy ? styles.panel__btn_busy : ''}`}>
                {busy ? 'იტვირთება...' : 'ფაილის ატვირთვა'}
                <input type="file" accept="image/*" hidden disabled={busy} onChange={uploadImage} />
              </label>
              <span className={styles.panel__or}>ან</span>
              <input className={styles.panel__input} type="text" value={imageUrl}
                placeholder="სურათის მისამართი https://..." onChange={(e) => setImageUrl(e.target.value)} />
              <input className={`${styles.panel__input} ${styles.panel__input_short}`} type="text" value={imageAlt}
                placeholder="აღწერა (alt) — SEO-სთვის" onChange={(e) => setImageAlt(e.target.value)} />
              <button type="button" className={styles.panel__btn} onClick={applyImageUrl} disabled={busy}>ჩასმა</button>
              <p className={styles.panel__hint}>სურათი კურსორის ადგილას ჩაჯდება. ჩასმის შემდეგ აირჩიეთ „მარცხნივ“ ან „მარჯვნივ“ — ტექსტი სურათის გვერდით დაიწერება.</p>
            </>
          )}

          {panel === 'video' && (
            <>
              <input className={styles.panel__input} type="text" value={videoUrl} autoFocus
                placeholder="YouTube-ის ბმული, მაგ. https://www.youtube.com/watch?v=..."
                onChange={(e) => setVideoUrl(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); applyVideo() } }} />
              <button type="button" className={styles.panel__btn} onClick={applyVideo}>ჩასმა</button>
            </>
          )}

          {panel === 'emoji' && (
            <div className={styles.emoji}>
              {EMOJIS.map((emoji) => (
                <button key={emoji} type="button" className={styles.emoji__btn}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => chain().insertContent(emoji).run()}>
                  {emoji}
                </button>
              ))}
            </div>
          )}

          <button type="button" className={styles.panel__close} onClick={closePanel} aria-label="დახურვა">✕</button>
          {notice && <p className={styles.panel__notice}>{notice}</p>}
        </div>
      )}
    </div>
  )
}
