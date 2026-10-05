'use client'

import { useEffect, useRef, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { buildExtensions } from './extensions'
import Toolbar from './Toolbar'
import styles from './RichEditor.module.scss'

/**
 * სრული ტექსტ-რედაქტორი (TipTap). მნიშვნელობა — HTML სტრიქონი; onChange(html) იძახება ყოველ ცვლილებაზე.
 * ბექი შენახვისას HTML-ს ასუფთავებს (back/utils/sanitizeHtml.js), ამიტომ რედაქტორი და სანიტაიზერი
 * ერთსა და იმავე თეგებს უნდა იცნობდნენ.
 */
export default function RichEditor({ value = '', onChange, title, placeholder }) {
  const [source, setSource] = useState(false)
  const [sourceText, setSourceText] = useState('')
  const [fullscreen, setFullscreen] = useState(false)

  // onChange-ის უახლესი ვერსია (useEditor-ის callback ერთხელ იქმნება) და ბოლოს გაგზავნილი HTML
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  const lastHtml = useRef(value)

  const editor = useEditor({
    immediatelyRender: false, // SSR-ის hydration შეცდომა არ მოხდეს
    extensions: buildExtensions({ placeholder }),
    content: value,
    onUpdate: ({ editor: instance }) => {
      const html = instance.getHTML()
      lastHtml.current = html
      onChangeRef.current?.(html)
    },
  })

  // გარედან შეცვლილი მნიშვნელობა (მაგ. ბექის მიერ გასუფთავებული HTML შენახვის შემდეგ)
  // რედაქტორშიც უნდა გამოჩნდეს. საკუთარი onChange-ის ექო (value === lastHtml) გამოტოვება.
  useEffect(() => {
    if (!editor || source) return
    if (value !== lastHtml.current) {
      lastHtml.current = value
      editor.commands.setContent(value || '', false)
    }
  }, [value, editor, source])

  // სრული ეკრანი: გვერდის სქროლი დაიბლოკოს და Esc-ით გამოვიდეს
  useEffect(() => {
    if (!fullscreen) return
    const onKey = (e) => { if (e.key === 'Escape') setFullscreen(false) }
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [fullscreen])

  const toggleSource = () => {
    if (!editor) return

    if (!source) {
      setSourceText(editor.getHTML())
      setSource(true)
    } else {
      // რედაქტორი ტექსტს ნორმალიზებს (უცნობ თეგებს აცილებს), შედეგი parent-საც გადაეცემა
      editor.commands.setContent(sourceText, true)
      setSource(false)
    }
  }

  const onSourceChange = (e) => {
    const html = e.target.value
    setSourceText(html)
    lastHtml.current = html
    onChangeRef.current?.(html) // შენახვა HTML რეჟიმიდანაც მუშაობს
  }

  const words = editor?.storage.characterCount?.words() ?? 0
  const characters = editor?.storage.characterCount?.characters() ?? 0

  return (
    <div className={`${styles.editor} ${fullscreen ? styles.editor__fullscreen : ''}`}>
      {title && <p className={styles.editor__title}>{title}</p>}

      <div className={styles.editor__box}>
        <Toolbar
          editor={editor}
          source={source}
          onToggleSource={toggleSource}
          fullscreen={fullscreen}
          onToggleFullscreen={() => setFullscreen((f) => !f)}
        />

        {source ? (
          <textarea
            className={styles.source}
            value={sourceText}
            onChange={onSourceChange}
            spellCheck={false}
            aria-label="HTML კოდი"
          />
        ) : (
          <EditorContent editor={editor} className={styles.content} />
        )}

        <div className={styles.status}>
          {words} სიტყვა · {characters} სიმბოლო
        </div>
      </div>
    </div>
  )
}
