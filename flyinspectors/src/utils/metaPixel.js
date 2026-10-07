// Meta პიქსელის ბრაუზერის მხარე. იმავე მოვლენებს სერვერიც აგზავნის (server/utils/metaCapi.js)
// ერთი და იმავე event_id-ით — Meta დუბლს აერთიანებს და კონვერსიას ორჯერ არ ითვლის.
// სახელები ბექშიც იგივე უნდა იყოს (server/controllers/clients.js, server/controllers/capi.js).
const PAGE_VIEW_EVENT = 'PageView'
const CLAIM_EVENT = 'Lead'
const REGISTRATION_EVENT = 'CompleteRegistration'

// Events Manager → Data sources. სერვერზე იგივე ნომერია (server/.env → META_PIXEL_ID).
// .env-ის დავიწყებამ პიქსელი ჩუმად არ უნდა გამორთოს, ამიტომ ნაგულისხმევი კოდშიცაა —
// პიქსელის ID საიდუმლო არ არის, ისედაც გვერდის HTML-ში ჩანს.
const FALLBACK_PIXEL_ID = '1400277778859172'
export const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || FALLBACK_PIXEL_ID

// პიქსელის ჩატვირთვა afterInteractive-ია და ad-blocker-ს შეუძლია სულაც არ გაუშვას.
// ამდენჯერ ვცდით და მერე ვტოვებთ — სერვერული მოვლენა მაინც იგზავნება.
const PIXEL_WAIT_TRIES = 20
const PIXEL_WAIT_MS = 100

const readCookie = (name) => {
  if (typeof document === 'undefined') return ''
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : ''
}

// _fbc-ს პიქსელი მხოლოდ fbclid-ის მქონე ბმულზე აყენებს. თუ ჯერ არ დაუსწრო (ან cookie აიკრძალა),
// Meta-ს ფორმატით თვითონ ვაწყობთ: fb.1.<დრო>.<fbclid> — რეკლამის დაწკაპუნება არ იკარგება.
const clickId = () => {
  const fromCookie = readCookie('_fbc')
  if (fromCookie) return fromCookie
  if (typeof window === 'undefined') return ''
  const fbclid = new URLSearchParams(window.location.search).get('fbclid')
  return fbclid ? `fb.1.${Date.now()}.${fbclid}` : ''
}

// event_id დედუპლიკაციის გასაღებია: ბრაუზერი და სერვერი ერთსა და იმავეს აგზავნიან
const newEventId = () => {
  const hasUuid = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
  return hasUuid ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

const currentUrl = () => (typeof window !== 'undefined' ? window.location.href : '')

// fbp/fbc და IP/User Agent ყველა მოვლენას უნდა მიჰყვეს. fbp/fbc cookie-ებია (ბექი ვერ კითხულობს),
// IP და User Agent კი პირიქით — მოთხოვნიდან მხოლოდ ბექი იღებს.
const cookies = () => ({ fbp: readCookie('_fbp'), fbc: clickId() })

// პიქსელის _fbp cookie-ს fbevents.js ჩატვირთვის შემდეგ აყენებს, ამიტომ cookie-ებს
// ლოდინის მერე ვკითხულობთ — თორემ პირველ PageView-ს fbp არ მოჰყვებოდა.
const waitForPixel = () =>
  new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false)

    let tries = 0
    const check = () => {
      if (typeof window.fbq === 'function' && window.fbq.loaded) return resolve(true)
      if (++tries >= PIXEL_WAIT_TRIES) return resolve(typeof window.fbq === 'function')
      setTimeout(check, PIXEL_WAIT_MS)
    }
    check()
  })

// ad-blocker-ის შემთხვევაში fbq არ არსებობს და უბრალოდ ვტოვებთ — სერვერული მოვლენა მაინც მიდის
const track = (eventName, eventId) => {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return
  window.fbq('track', eventName, {}, { eventID: eventId })
}

// CAPI endpoint: ბექი მოთხოვნიდან IP-სა და User Agent-ს თვითონ იღებს.
// keepalive — გვერდის გადასვლაზეც არ წყდება; შეცდომას ვჩუმდებით, მომხმარებელს არ ეხება.
const sendToServer = (path, body) => {
  const base = process.env.NEXT_PUBLIC_API_URL
  if (!base) return Promise.resolve()

  return fetch(`${base}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => {})
}

/**
 * PageView ორივე მხრიდან: პიქსელი ბრაუზერიდან, CAPI სერვერიდან — ერთი event_id-ით.
 * app/MetaPageView.jsx-ი ყოველ გვერდზე (SPA-ს გადასვლაზეც) იძახებს.
 */
export async function trackPageView() {
  if (typeof window === 'undefined') return

  const eventId = newEventId()
  const eventSourceUrl = currentUrl()

  await waitForPixel()
  track(PAGE_VIEW_EVENT, eventId)

  await sendToServer('/capi/pageview', { eventId, eventSourceUrl, ...cookies() })
}

/**
 * განაცხადთან ერთად ბექში გასაგზავნი ველები (ბექი მათ ბაზაში არ წერს).
 * ორი event_id: თითო მოვლენას თავისი, თორემ Meta Lead-სა და CompleteRegistration-ს
 * ერთმანეთში აურევდა.
 */
export function metaEventFields() {
  return {
    eventId: newEventId(),
    registrationEventId: newEventId(),
    eventSourceUrl: currentUrl(),
    ...cookies(),
  }
}

/** განაცხადის გაგზავნა: Lead + CompleteRegistration. metaEventFields()-ის შედეგს იღებს. */
export function trackClaimSubmitted({ eventId, registrationEventId } = {}) {
  track(CLAIM_EVENT, eventId)
  track(REGISTRATION_EVENT, registrationEventId)
}
