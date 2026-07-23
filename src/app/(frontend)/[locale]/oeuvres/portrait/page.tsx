import { getPayload } from 'payload'
import { getTranslations } from 'next-intl/server'
import configPromise from '@payload-config'
import { WorksGallery } from '@/components/WorksGallery'

export default async function PortraitPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const payload = await getPayload({ config: configPromise })
  const t = await getTranslations({ locale, namespace: 'works' })

  const works = await payload.find({
    collection: 'works',
    where: { type: { equals: 'portrait' } },
    sort: 'order',
    limit: 0,
    locale: locale as 'fr' | 'en',
  }).catch(() => ({ docs: [] }))

  return (
    <div>
      <h1 className="page-enter">{t('portrait')}</h1>

      {works.docs.length === 0 ? (
        <p className="text-[13px] text-[var(--muted)] font-light">À venir.</p>
      ) : (
        <WorksGallery
          works={works.docs
            .filter((work) => typeof work.image === 'object' && work.image)
            .map((work) => ({
              id: String(work.id),
              title: work.title,
              description: work.description ?? undefined,
              image: { url: (work.image as { url: string }).url, alt: work.title },
            }))}
        />
      )}
    </div>
  )
}
