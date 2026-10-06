// Meta პიქსელის ბრაუზერის მხარე. იმავე მოვლენას სერვერიც აგზავნის (server/utils/metaCapi.js)
// ერთი და იმავე event_id-ით — Meta დუბლს აერთიანებს და კონვერსიას ორჯერ არ ითვლის.
// სახელი ბექშიც იგივე უნდა იყოს (server/controllers/clients.js → CLAIM_EVENT).
const CLAIM_EVENT = 'Lead'

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

// განაცხადთან ერთად ბექში გასაგზავნი ველები (ბექი მათ ბაზაში არ წერს)
export function metaEventFields() {
  const hasUuid = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
  return {
    eventId: hasUuid ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    eventSourceUrl: typeof window !== 'undefined' ? window.location.href : '',
    fbp: readCookie('_fbp'),
    fbc: clickId(),
  }
}

// ad-blocker-ის შემთხვევაში fbq არ არსებობს და უბრალოდ ვტოვებთ — სერვერული მოვლენა მაინც მიდის
export function trackClaimSubmitted(eventId) {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return
  window.fbq('track', CLAIM_EVENT, {}, { eventID: eventId })
}
