import { Extension, Node, mergeAttributes } from '@tiptap/core'
import { Fragment } from '@tiptap/pm/model'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import FontFamily from '@tiptap/extension-font-family'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'

// შრიფტის ზომა: TipTap v2-ს ასეთი მზა გაფართოება არ აქვს. textStyle-ის ატრიბუტია
// (<span style="font-size: 18px">) — ბექის სანიტაიზერი ამ სტილს უშვებს.
const FontSize = Extension.create({
  name: 'fontSize',

  addOptions() {
    return { types: ['textStyle'] }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize?.replace(/['"]+/g, '') || null,
            renderHTML: (attributes) =>
              attributes.fontSize ? { style: `font-size: ${attributes.fontSize}` } : {},
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setFontSize:
        (fontSize) =>
        ({ chain }) =>
          chain().setMark('textStyle', { fontSize }).run(),
      unsetFontSize:
        () =>
        ({ chain }) =>
          chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run(),
    }
  },
})

// ძველი რედაქტორი (draft-js) ხაზგასმას <ins>-ით წერდა; ახალი <u>-ს წერს, ძველსაც ვკითხულობთ,
// რომ უკვე შენახული ტექსტის ფორმატირება არ დაიკარგოს
const UnderlineCompat = Underline.extend({
  parseHTML() {
    return [{ tag: 'u' }, { tag: 'ins' }, ...(this.parent?.() || [])]
  },
})

// სურათი ტექსტის შიგნით ჩაისმება (inline), რომ გვერდით ტექსტის დაწერა შეიძლებოდეს.
//   align — left | right: სურათი გვერდზე გადადის და ტექსტი მას გარს უვლის; center — ცენტრში, ცალკე ხაზზე
//   size  — სიგანე კონტეინერის პროცენტებში (25, 33, 50, 75, 100)
// ატრიბუტები data-* სახითაა და არა inline style-ად: ბექი მათ მხოლოდ დაშვებულ მნიშვნელობებზე უშვებს,
// საიტზე კი CSS (app/globals.scss, .rich-content) მობილურზე გადატანას თავისით აგვარებს.
const ImageWithLayout = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-align'),
        renderHTML: (attributes) => (attributes.align ? { 'data-align': attributes.align } : {}),
      },
      size: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-size'),
        renderHTML: (attributes) => (attributes.size ? { 'data-size': attributes.size } : {}),
      },
    }
  },
})

// ---------- სვეტები ----------
// ორსვეტიანი განლაგება: <div data-columns="2"><div data-column>...</div><div data-column>...</div></div>.
// თითოეულ სვეტში ნებისმიერი შიგთავსი შეიძლება (ტექსტი, სათაური, სია, ცხრილი, YouTube, ციტატა, კოდი,
// ხაზი; სურათი ტექსტის შიგნითაა). სვეტში სვეტი (ჩალაგება) განზრახ აკრძალულია.
//   ratio — მარცხენა სვეტის წილი პროცენტებში: 33 | 50 (ნაგულისხმევი) | 67
// ატრიბუტები data-* სახითაა: ბექი მათ მხოლოდ დაშვებულ მნიშვნელობებზე უშვებს, საიტზე კი CSS
// (app/globals.scss, .rich-content) მობილურზე სვეტებს ერთმანეთის ქვეშ აწყობს.
const COLUMN_CONTENT = '(paragraph | heading | bulletList | orderedList | blockquote | codeBlock | horizontalRule | table | youtube)+'

const Column = Node.create({
  name: 'column',
  content: COLUMN_CONTENT,
  isolating: true, // Backspace/Delete სვეტის საზღვარს ვერ გადაკვეთს
  defining: true,

  parseHTML() {
    return [{ tag: 'div[data-column]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-column': '' }), 0]
  },
})

// columns ბლოკის გარშემო მოძებნა: ბლოკის პოზიცია და node (კურსორი მის რომელიმე სვეტშია)
function findColumns(state) {
  const { $from } = state.selection
  for (let depth = $from.depth; depth > 0; depth--) {
    const node = $from.node(depth)
    if (node.type.name === 'columns') return { node, pos: $from.before(depth) }
  }
  return null
}

const Columns = Node.create({
  name: 'columns',
  group: 'block',
  content: 'column{2}',
  isolating: true,
  defining: true,

  addAttributes() {
    return {
      ratio: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-ratio'),
        renderHTML: (attributes) => (attributes.ratio ? { 'data-ratio': attributes.ratio } : {}),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-columns]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-columns': '2' }), 0]
  },

  addCommands() {
    return {
      // ორი ცარიელი სვეტი კურსორის ადგილას
      insertColumns:
        () =>
        ({ commands }) =>
          commands.insertContent({
            type: 'columns',
            content: [
              { type: 'column', content: [{ type: 'paragraph' }] },
              { type: 'column', content: [{ type: 'paragraph' }] },
            ],
          }),

      setColumnsRatio:
        (ratio) =>
        ({ tr, state, dispatch }) => {
          const found = findColumns(state)
          if (!found) return false
          if (dispatch) tr.setNodeMarkup(found.pos, undefined, { ...found.node.attrs, ratio })
          return true
        },

      // სვეტების ადგილების გაცვლა
      swapColumns:
        () =>
        ({ tr, state, dispatch }) => {
          const found = findColumns(state)
          if (!found) return false
          const [first, second] = [found.node.child(0), found.node.child(1)]
          if (dispatch) {
            tr.replaceWith(found.pos, found.pos + found.node.nodeSize, found.node.type.create(found.node.attrs, [second, first]))
          }
          return true
        },

      // სვეტების მოხსნა: შიგთავსი ერთმანეთის მიყოლებით რჩება (პირველი სვეტი, მერე მეორე)
      unwrapColumns:
        () =>
        ({ tr, state, dispatch }) => {
          const found = findColumns(state)
          if (!found) return false
          const content = Fragment.fromArray([...found.node.child(0).content.content, ...found.node.child(1).content.content])
          if (dispatch) tr.replaceWith(found.pos, found.pos + found.node.nodeSize, content)
          return true
        },

      deleteColumns:
        () =>
        ({ tr, state, dispatch }) => {
          const found = findColumns(state)
          if (!found) return false
          if (dispatch) tr.delete(found.pos, found.pos + found.node.nodeSize)
          return true
        },
    }
  },
})

// დოკუმენტის ბოლოს ყოველთვის აბზაცი უნდა იყოს: ცხრილის, ვიდეოს ან სვეტების შემდეგ
// კურსორი სადმე რომ დაიდოს და ტექსტის დაწერა გაგრძელდეს
const TrailingParagraph = Extension.create({
  name: 'trailingParagraph',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('trailingParagraph'),
        appendTransaction: (transactions, oldState, newState) => {
          const { doc, tr, schema } = newState
          const last = doc.lastChild
          if (!last || last.type.name === 'paragraph') return null
          return tr.insert(doc.content.size, schema.nodes.paragraph.create())
        },
      }),
    ]
  },
})

// რედაქტორის გაფართოებების სია. H1 განზრახ არ არის: გვერდის სათაური (h1) საიტის კოდშია,
// ხოლო ბექი ტექსტში მოსულ h1-ს ყოველ შემთხვევაში h2-ად აქცევს.
export function buildExtensions({ placeholder } = {}) {
  return [
    StarterKit.configure({ heading: { levels: [2, 3, 4, 5, 6] } }),
    UnderlineCompat,
    Subscript,
    Superscript,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    TextStyle,
    Color,
    FontFamily,
    FontSize,
    Highlight.configure({ multicolor: true }),
    Link.configure({
      openOnClick: false,
      autolink: true,
      // target/rel ხელით იწერება (ბმულის პანელი): საკუთარ გვერდზე მიმავალ ბმულს nofollow არ სჭირდება
      HTMLAttributes: { target: null, rel: null },
    }),
    ImageWithLayout.configure({ inline: true, allowBase64: false }),
    Youtube.configure({ nocookie: true, width: 640, height: 360, controls: true }),
    Table.configure({ resizable: false }),
    TableRow,
    TableHeader,
    TableCell,
    Columns,
    Column,
    TrailingParagraph,
    Placeholder.configure({ placeholder: placeholder || 'დაწერეთ ტექსტი...' }),
    CharacterCount,
  ]
}
