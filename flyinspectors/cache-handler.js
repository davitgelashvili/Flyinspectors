// ISR/fetch კეში მეხსიერებაში. ნაგულისხმევი კეში .next/server/app-ში წერს — ეს ფაილები git-შია,
// და სერვერზე runtime-ში გადაწერილი ფაილების გამო cPanel-ის git pull ჩერდება.
const cache = new Map()

function entryTags(entry) {
  const fromCtx = entry.tags || []
  const header = entry.value?.headers?.['x-next-cache-tags']
  const fromPage = typeof header === 'string' ? header.split(',') : []
  return fromCtx.concat(fromPage)
}

module.exports = class CacheHandler {
  constructor(options) {
    this.options = options
  }

  async get(key) {
    return cache.get(key) ?? null
  }

  async set(key, data, ctx) {
    cache.set(key, { value: data, lastModified: Date.now(), tags: ctx?.tags || [] })
  }

  async revalidateTag(tags) {
    const wanted = [].concat(tags)
    for (const [key, entry] of cache) {
      if (entryTags(entry).some((t) => wanted.includes(t))) cache.delete(key)
    }
  }
}
