// Google reCAPTCHA v3 — უხილავი შემოწმება: ვიზიტორი არაფერზე არ აწკაპუნებს,
// ფორმის გაგზავნამდე ბრაუზერი ტოკენს აწარმოებს და ბექი მას Google-თან ამოწმებს
// (server/middleware/recaptcha.js). action-ების სახელები ორივე მხარეს ერთნაირია.
export const RECAPTCHA_ACTIONS = {
  claim: 'claim_submit',
  claimNotify: 'claim_notify',
  claimReceipt: 'claim_receipt',
  contact: 'contact_submit',
  signature: 'claim_notify',
}

const SCRIPT_ID = 'recaptcha-v3'

// გასაღები პირველ რიგში ბექიდან მოდის (GET /api/recaptcha). NEXT_PUBLIC_* Next-ში
// build-ის დროს იკერება, ანუ სერვერის გარემოში დაყენებული ცვლადი ბრაუზერამდე ვერ
// მივიდოდა — ამიტომ runtime-ზე ვკითხულობთ. build-ში თუ მაინც ჩაიწერა, ის ჯობია:
// ერთი მოთხოვნა იკლებს.
const BUILD_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''

let keyPromise = null
let loader = null

/** '' → გასაღები არ არის, ანუ შემოწმება გამორთულია */
function resolveSiteKey() {
  if (BUILD_SITE_KEY) return Promise.resolve(BUILD_SITE_KEY)

  if (!keyPromise) {
    keyPromise = fetch(`${process.env.NEXT_PUBLIC_API_URL}/recaptcha`)
      .then((res) => res.json())
      .then((data) => (data && data.siteKey) || '')
      .catch(() => '')
      .then((key) => {
        // ცარიელი პასუხი არ უნდა დაიკეშოს — შემდეგი ცდა ხელახლა იკითხავს
        if (!key) keyPromise = null
        return key
      })
  }

  return keyPromise
}

/** სკრიპტს ერთხელ ვტვირთავთ და დანარჩენი გამოძახებები იმავე Promise-ს ელოდება */
function loadScript(siteKey) {
  if (loader) return loader

  loader = new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('no window'))
    if (window.grecaptcha && window.grecaptcha.execute) return resolve(window.grecaptcha)

    const existing = document.getElementById(SCRIPT_ID)
    const script = existing || document.createElement('script')

    script.addEventListener('load', () => {
      // grecaptcha.ready — სკრიპტი ჩატვირთულია, მაგრამ შიდა ინიციალიზაცია ჯერ მიმდინარეობს
      window.grecaptcha.ready(() => resolve(window.grecaptcha))
    })
    script.addEventListener('error', () => reject(new Error('recaptcha script failed')))

    if (!existing) {
      script.id = SCRIPT_ID
      script.async = true
      script.defer = true
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`
      document.head.appendChild(script)
    }
  })

  // ჩავარდნილი ჩატვირთვა არ უნდა დაიკეშოს — შემდეგი ცდა ახალს დაიწყებს
  loader.catch(() => {
    loader = null
  })

  return loader
}

/**
 * ფორმის გვერდზე გასაღების და სკრიპტის წინასწარ ჩატვირთვა, რომ გაგზავნაზე
 * ლოდინი არ დაემატოს. უსაფრთხოა მრავალჯერ გამოძახება.
 */
export function preloadRecaptcha() {
  resolveSiteKey()
    .then((key) => (key ? loadScript(key) : null))
    .catch(() => {})
}

/**
 * ტოკენი ერთჯერადია და ~2 წუთში ვადა გასდის — ყოველი გაგზავნისთვის ახალს ვიღებთ.
 * ცარიელი პასუხი ნიშნავს, რომ გასაღები არ არის ან სკრიპტი ვერ ჩაიტვირთა;
 * ბექი ასეთ შემთხვევას თავად წყვეტს.
 */
export async function getRecaptchaToken(action) {
  try {
    const siteKey = await resolveSiteKey()
    if (!siteKey) return ''

    const grecaptcha = await loadScript(siteKey)
    return await grecaptcha.execute(siteKey, { action })
  } catch (error) {
    console.error('reCAPTCHA token error:', error)
    return ''
  }
}

/** fetch-ის header-ები ტოკენთან ერთად — body ხელუხლებელი რჩება */
export async function recaptchaHeaders(action) {
  const token = await getRecaptchaToken(action)
  return token ? { 'x-recaptcha-token': token } : {}
}
