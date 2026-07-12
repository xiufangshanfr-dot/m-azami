import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NewsCard } from '@/components/NewsCard'

export default async function ActualitesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const payload = await getPayload({ config: configPromise })

  const news = await payload.find({
    collection: 'news',
    sort: '-publishedAt',
    where: { _status: { equals: 'published' } },
    locale: locale as 'fr' | 'en',
  }).catch(() => ({ docs: [] }))

  return (
    <div>
      <h1 className="page-enter">Actualités</h1>

      {news.docs.length === 0 ? (
        <p className="text-[13px] text-[var(--muted)] font-light">À venir.</p>
      ) : (
        <div className="page-enter-1 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
          {news.docs.map((item) => {
            const coverImage = typeof item.coverImage === 'object' ? item.coverImage : null
            if (!coverImage) return null
            const date = item.publishedAt
              ? new Date(item.publishedAt).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-GB', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })
              : undefined
            return (
              <NewsCard
                key={item.id}
                title={item.title}
                coverImage={{ url: (coverImage as { url: string }).url, alt: item.title }}
                slug={item.slug || String(item.id)}
                locale={locale}
                date={date}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
