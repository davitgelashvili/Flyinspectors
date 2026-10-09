import { getPageSeo } from '@/i18n/pageMeta'
import { JsonLd, webPageSchema } from './jsonLd'

// სერვერ კომპონენტები: სათაური, აღწერა და ფოტო იმავე წყაროდან მოდის, საიდანაც მეტა ტეგები
// (ბაზა → ადმინი → მეტა თეგები, ან pageMeta.js), ამიტომ schema.org მეტა ტეგებს ემთხვევა.

// type: 'AboutPage' | 'ContactPage'
export async function WebPageJsonLd({ type, path, lang }) {
  const { locale, meta } = await getPageSeo(path, lang)
  return (
    <JsonLd
      data={webPageSchema({
        type,
        path,
        locale,
        name: meta?.title,
        description: meta?.description,
        imageUrl: meta?.image,
      })}
    />
  )
}
