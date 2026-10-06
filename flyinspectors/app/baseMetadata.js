import { getSiteHost, getSiteOrigin } from './siteHost'

// Google Search Console-ის დადასტურება. თითოეულ property-ს (დომენს) საკუთარი ტოკენი აქვს,
// ამიტომ host-ის მიხედვით ვირჩევთ. ჯერ მხოლოდ ერთი ტოკენი გვაქვს და სამივე დომენზე იგივე
// ბრუნდება — .com-ისა და .co.uk-ის property-ების დადასტურებისას მათი ტოკენები აქ ჩაიწერება.
const GOOGLE_VERIFICATION = {
  'flyinspectors.ge': 'OfjFw3NSgf2ud98CgvKq11EBac1K4ca3VeooKc6Mvzg',
  'flyinspectors.com': 'OfjFw3NSgf2ud98CgvKq11EBac1K4ca3VeooKc6Mvzg',
  'flyinspectors.co.uk': 'OfjFw3NSgf2ud98CgvKq11EBac1K4ca3VeooKc6Mvzg',
}

// საერთო მეტა-ინფორმაცია: საიტისთვისაც და ადმინისთვისაც (ორივეს საკუთარი root layout აქვს).
// ფუნქციაა და არა ობიექტი, რადგან metadataBase და ტოკენი მოთხოვნის დომენზეა დამოკიდებული:
// canonical და hreflang იმ დომენს აჩვენებს, რომელზეც მომხმარებელი შევიდა.
export function baseMetadata() {
  const google = GOOGLE_VERIFICATION[getSiteHost()]
  return {
    icons: {
      icon: '/favicon.png',
      apple: '/favicon.png',
    },
    other: {
      'facebook-domain-verification': 'zmft3mvrj1aqht2us3b9a8svelegtx',
    },
    ...(google && { verification: { google } }),
    metadataBase: new URL(getSiteOrigin()),
  }
}

// საჯარო გვერდები: ინდექსირება ნებადართულია და ძიებაში სრული ტექსტი/დიდი ფოტო ჩანს
export const INDEX_ROBOTS = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
}

// ადმინი და პირადი განაცხადის ნაბიჯები ძიებაში არ უნდა ჩანდეს
export const NOINDEX_ROBOTS = {
  index: false,
  follow: false,
  googleBot: { index: false, follow: false },
}
