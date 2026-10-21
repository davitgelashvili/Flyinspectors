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

// ---------- style-ის შენარჩუნება ----------
// HTML რეჟიმში ჩაწერილი style ატრიბუტი (<p style="margin:0">, <span style="background-color:...">) რედაქტორში
// ინახება და ბექამდე მიდის. რედაქტორის სხვა ატრიბუტები (text-align, color, font-*) თავის თავს მართავს,
// ამიტომ style-იდან ისინი იშლება — წინააღმდეგ შემთხვევაში ერთი და იგივე წესი ორჯერ გროვდება.
const TEXT_ALIGN_STYLE = /text-align\s*:[^;]*;?/gi
const TEXT_STYLE_OWNED = /(?<![-\w])(color|font-family|font-size)\s*:[^;]*;?/gi

const KeepStyle = Extension.create({
  name: 'keepStyle',

  addGlobalAttributes() {
    const keptStyle = (owned = null) => ({
      default: null,
      parseHTML: (element) => {
        const style = element.getAttribute('style') ?? ''
        return (owned ? style.replace(owned, '') : style).trim() || null
      },
      renderHTML: (attributes) => (attributes.style ? { style: attributes.style } : {}),
    })

    return [
      {
        types: ['paragraph', 'heading', 'blockquote', 'bulletList', 'orderedList', 'listItem', 'table', 'tableRow', 'tableHeader', 'tableCell', 'image', 'codeBlock', 'horizontalRule'],
        attributes: { style: keptStyle(TEXT_ALIGN_STYLE) },
      },
      {
        types: ['textStyle'],
        attributes: { style: keptStyle(TEXT_STYLE_OWNED) },
      },
      {
        types: ['bold', 'italic', 'underline', 'strike', 'code', 'subscript', 'superscript', 'link'],
        attributes: { style: keptStyle() },
      },
    ]
  },
})

// სტილიანი კონტეინერი: <div style="..."> (ან section, article, header...) — ბლოკი, რომელიც შიგთავსს
// აჯგუფებს და სტილს ინარჩუნებს. თეგის სახელი ინახება, რომ <section> <section>-ად დარჩეს.
// სვეტებისა და YouTube-ის გარსებს საკუთარი node აქვთ, ამიტომ მათ აქ არ ვიღებთ.
const CONTAINER_TAGS = ['div', 'section', 'article', 'header', 'footer', 'aside', 'main', 'figure']

const Container = Node.create({
  name: 'container',
  group: 'block',
  content: 'block+',
  defining: true,

  addAttributes() {
    return {
      tag: {
        default: 'div',
        parseHTML: (element) => element.tagName.toLowerCase(),
        renderHTML: () => ({}),
      },
      style: {
        default: null,
        parseHTML: (element) => element.getAttribute('style') || null,
        renderHTML: (attributes) => (attributes.style ? { style: attributes.style } : {}),
      },
    }
  },

  parseHTML() {
    return CONTAINER_TAGS.map((tag) => ({
      tag,
      priority: 10, // ნაგულისხმევ (50) წესებს ქვემოთ, რომ სვეტები და YouTube თავისი წესით დამუშავდეს
      getAttrs: (element) =>
        element.hasAttribute('data-youtube-video') || element.hasAttribute('data-columns') || element.hasAttribute('data-column')
          ? false
          : {},
    }))
  },

  renderHTML({ node, HTMLAttributes }) {
    return [node.attrs.tag, mergeAttributes(HTMLAttributes), 0]
  },
})

// ---------- სვეტები ----------
// ორსვეტიანი განლაგება: <div data-columns="2"><div data-column>...</div><div data-column>...</div></div>.
// თითოეულ სვეტში ნებისმიერი შიგთავსი შეიძლება (ტექსტი, სათაური, სია, ცხრილი, YouTube, ციტატა, კოდი,
// ხაზი, კონტეინერი; სურათი ტექსტის შიგნითაა). სვეტში სვეტი (ჩალაგება) განზრახ აკრძალულია.
//   ratio — მარცხენა სვეტის წილი პროცენტებში: 33 | 50 (ნაგულისხმევი) | 67
// ატრიბუტები data-* სახითაა: ბექი მათ მხოლოდ დაშვებულ მნიშვნელობებზე უშვებს, საიტზე კი CSS
// (app/globals.scss, .rich-content) მობილურზე სვეტებს ერთმანეთის ქვეშ აწყობს.
const COLUMN_CONTENT = '(paragraph | heading | bulletList | orderedList | blockquote | codeBlock | horizontalRule | table | youtube | container | rawBlock)+'

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

// ---------- სხვა ატრიბუტები ----------
// class, id, role, data-*, lang... რედაქტორის node-ები თავად არ ინახავენ. ამიტომ ყველა ატრიბუტი, რომელსაც
// რედაქტორი სხვაგან არ მართავს (MANAGED_ATTRS), უცვლელად ინახება და უკან იწერება.
const MANAGED_ATTRS = new Set([
  'style', 'href', 'target', 'rel', 'src', 'alt', 'width', 'height', 'colspan', 'rowspan', 'colwidth', 'start',
  'data-align', 'data-size', 'data-color', 'data-youtube-video', 'data-columns', 'data-column', 'data-ratio',
])

const HtmlAttrs = Extension.create({
  name: 'htmlAttrs',

  addGlobalAttributes() {
    return [
      {
        types: [
          'paragraph', 'heading', 'blockquote', 'bulletList', 'orderedList', 'listItem', 'table', 'tableRow',
          'tableHeader', 'tableCell', 'image', 'codeBlock', 'horizontalRule', 'container', 'hardBreak',
          'bold', 'italic', 'underline', 'strike', 'code', 'subscript', 'superscript', 'link', 'highlight', 'textStyle',
        ],
        attributes: {
          htmlAttrs: {
            default: null,
            parseHTML: (element) => {
              const attrs = Object.fromEntries(
                [...element.attributes].filter((attr) => !MANAGED_ATTRS.has(attr.name)).map((attr) => [attr.name, attr.value])
              )
              return Object.keys(attrs).length ? attrs : null
            },
            renderHTML: (attributes) => attributes.htmlAttrs ?? {},
          },
        },
      },
    ]
  },
})

// ---------- უცნობი ელემენტები ----------
// რედაქტორს ყველა თეგის სქემა არ აქვს (nav, button, video, details, font...). ასეთი ელემენტი აქ უცვლელად
// ინახება თავისი HTML-ით და ისე იხატება, როგორც ჩაიწერა. ბლოკური ელემენტები (nav, details...) და ხაზშიდა
// (font, label, small...) ცალკე node-ებია, რომ აბზაცი არ გატყდეს.
// SCHEMA_TAGS — თეგები, რომლებსაც რედაქტორი თავად ამუშავებს (ან სტრუქტურულია და მისი შიგთავსი იკითხება).
const SCHEMA_TAGS = new Set([
  'p', 'br', 'hr', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
  'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'del', 'ins', 'sub', 'sup', 'mark', 'a', 'span', 'img',
  'div', 'section', 'article', 'header', 'footer', 'aside', 'main', 'figure',
  'table', 'caption', 'colgroup', 'col', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
])
const BLOCK_RAW_TAGS = new Set([
  'nav', 'details', 'summary', 'form', 'fieldset', 'legend', 'center', 'address', 'dl', 'dt', 'dd', 'menu', 'hgroup', 'dialog', 'noscript',
])

const rawParseRules = (blockLevel) => [
  {
    tag: '*',
    priority: 1, // ყველა სხვა წესის შემდეგ — მხოლოდ იმას იჭერს, რაც სხვამ არ აიღო
    getAttrs: (element) => {
      const tag = element.tagName.toLowerCase()
      if (SCHEMA_TAGS.has(tag) || BLOCK_RAW_TAGS.has(tag) !== blockLevel) return false
      return { html: element.outerHTML }
    },
  },
]

// ელემენტი DOM-ად: შაბლონიდან, რომ სკრიპტები და სხვა შიგთავსი არ გაეშვას რედაქტორის გარეთ
const rawDom = (html) => {
  const template = document.createElement('template')
  template.innerHTML = html
  return template.content.firstElementChild
}

const rawNodeView = {
  addNodeView() {
    return ({ node }) => {
      const dom = rawDom(node.attrs.html)
      dom.setAttribute('contenteditable', 'false')
      return { dom }
    }
  },
}

const RawBlock = Node.create({
  name: 'rawBlock',
  group: 'block',
  atom: true,
  selectable: true,

  addAttributes() {
    return { html: { default: '' } }
  },

  parseHTML() {
    return [
      // ცხრილი სათაურით, ქვედა კოლონტიტულით, ან სურათის/სვეტის განსაზღვრებით მთლიანად ინახება,
      // რომ thead/tfoot და მათი სტილი არ დაიკარგოს
      {
        tag: 'table',
        priority: 60,
        getAttrs: (element) => (element.querySelector('thead, tfoot, caption, colgroup') ? { html: element.outerHTML } : false),
      },
      ...rawParseRules(true),
    ]
  },

  renderHTML({ node }) {
    return rawDom(node.attrs.html)
  },

  ...rawNodeView,
})

const RawInline = Node.create({
  name: 'rawInline',
  group: 'inline',
  inline: true,
  atom: true,
  selectable: true,

  addAttributes() {
    return { html: { default: '' } }
  },

  parseHTML() {
    return rawParseRules(false)
  },

  renderHTML({ node }) {
    return rawDom(node.attrs.html)
  },

  ...rawNodeView,
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
          // setContent-ით (emitUpdate=false) შემოსული ცვლილება parent-ს არ უნდა გადაეცეს
          if (transactions.some((t) => t.getMeta('preventUpdate'))) tr.setMeta('preventUpdate', true)
          return tr.insert(doc.content.size, schema.nodes.paragraph.create())
        },
      }),
    ]
  },
})

// რედაქტორის გაფართოებების სია (ყველა თეგი და სტილი შენარჩუნდება).
export function buildExtensions({ placeholder } = {}) {
  return [
    StarterKit.configure({ heading: { levels: [1, 2, 3, 4, 5, 6] } }),
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
    ImageWithLayout.configure({ inline: true, allowBase64: true }),
    Youtube.configure({ nocookie: true, width: 640, height: 360, controls: true }),
    Table.configure({ resizable: false }),
    TableRow,
    TableHeader,
    TableCell,
    Columns,
    Column,
    Container,
    KeepStyle,
    HtmlAttrs,
    RawBlock,
    RawInline,
    TrailingParagraph,
    Placeholder.configure({ placeholder: placeholder || 'დაწერეთ ტექსტი...' }),
    CharacterCount,
  ]
}
