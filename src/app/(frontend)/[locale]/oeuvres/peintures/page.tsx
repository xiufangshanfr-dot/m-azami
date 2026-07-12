import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { WorkCard } from '@/components/WorkCard'

export default async function PeinturesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const payload = await getPayload({ config: configPromise })

  const works = await payload.find({
    collection: 'works',
    where: { type: { equals: 'peinture' } },
    sort: 'order',
    locale: locale as 'fr' | 'en',
  }).catch(() => ({ docs: [] }))

  return (
    <div>
      <h1 className="page-enter">Peintures</h1>

      {works.docs.length === 0 ? (
        <p className="text-[13px] text-[var(--muted)] font-light">À venir.</p>
      ) : (
        <div className="page-enter-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {works.docs.map((work) => {
            const image = typeof work.image === 'object' ? work.image : null
            if (!image) return null
            return (
              <WorkCard
                key={work.id}
                title={work.title}
                description={work.description}
                image={{ url: (image as { url: string }).url, alt: work.title }}
                slug={work.slug || String(work.id)}
                locale={locale}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
