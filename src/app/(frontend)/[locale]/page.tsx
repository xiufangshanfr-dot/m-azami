import Image from 'next/image'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NewsCard } from '@/components/NewsCard'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const payload = await getPayload({ config: configPromise })

  const [homepage, latestNews] = await Promise.all([
    payload.findGlobal({ slug: 'homepage', locale: locale as 'fr' | 'en' }).catch(() => null),
    payload.find({
      collection: 'news',
      limit: 2,
      sort: '-publishedAt',
      where: { _status: { equals: 'published' } },
      locale: locale as 'fr' | 'en',
    }).catch(() => ({ docs: [] })),
  ])

  const banner = homepage?.banners?.[0]
  const introText = homepage?.introText || ''

  return (
    <div>
      {banner?.image && typeof banner.image === 'object' && (
        <div className="page-enter mb-14">
          <Image
            src={(banner.image as { url: string }).url}
            alt="MORY AZAMI"
            width={841}
            height={404}
            className="w-full h-auto object-cover"
            priority
          />
        </div>
      )}

      {introText && (
        <div className="page-enter-1 max-w-xl mb-20">
          <p className="font-garamond text-base leading-relaxed text-[var(--ink)] opacity-80 whitespace-pre-line">
            {introText}
          </p>
        </div>
      )}

      {latestNews.docs.length > 0 && (
        <section className="page-enter-2">
          <div className="flex items-center gap-6 mb-8">
            <h2 className="text-[11px] font-extralight tracking-[0.2em] uppercase text-[var(--muted)] m-0">
              Actualités
            </h2>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
            {latestNews.docs.map((item) => {
              const coverImage = typeof item.coverImage === 'object' ? item.coverImage : null
              if (!coverImage) return null
              const date = item.publishedAt
                ? new Date(item.publishedAt).toLocaleDateString(
                    locale === 'fr' ? 'fr-FR' : 'en-GB',
                    { year: 'numeric', month: 'long', day: 'numeric' },
                  )
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
        </section>
      )}
    </div>
  )
}
