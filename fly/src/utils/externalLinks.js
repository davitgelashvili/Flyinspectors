// ადმინის რედაქტორით ჩაწერილ HTML-ში (FAQ, წესები, ქასთუმ გვერდები...) გარე ბმულებს
// target="_blank" rel="nofollow noopener" ემატება. საიტის საკუთარი დომენების, mailto:/tel: და
// შიდა ბმულები უცვლელი რჩება.
const OWN_HOSTS = ['flyinspectors.com', 'flyinspectors.ge', 'flyinspectors.co.uk']

const isExternal = (href) => {
  try {
    const url = new URL(href)
    if (!/^https?:$/.test(url.protocol)) return false
    return !OWN_HOSTS.includes(url.hostname.replace(/^www\./, ''))
  } catch {
    return false // შიდა (/ka/...), #, mailto:, tel:
  }
}

export function externalLinks(html) {
  if (!html) return html
  return html.replace(/<a\s([^>]*)>/gi, (tag, attrs) => {
    const href = attrs.match(/\shref\s*=\s*"([^"]*)"/i)?.[1] ?? attrs.match(/^href\s*=\s*"([^"]*)"/i)?.[1]
    if (!href || !isExternal(href.replace(/&amp;/g, '&'))) return tag
    const rest = attrs.replace(/\s*(target|rel)\s*=\s*("[^"]*"|'[^']*')/gi, '').trim()
    return `<a ${rest} target="_blank" rel="nofollow noopener">`
  })
}
