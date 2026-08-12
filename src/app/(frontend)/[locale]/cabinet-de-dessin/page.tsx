import { getPayload } from 'payload'
import { getTranslations } from 'next-intl/server'
import configPromise from '@payload-config'
import { ContentBlocksRenderer, type ContentBlockData } from '@/components/ContentBlocksRenderer'

export default async function CabinetDeDessinPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const payload = await getPayload({ config: configPromise })
  const t = await getTranslations({ locale, namespace: 'nav' })

  const data = await payload
    .findGlobal({ slug: 'cabinet-de-dessin', locale: locale as 'fr' | 'en' })
    .catch(() => null)

  const content = (data?.content ?? []) as ContentBlockData[]

  return (
    <div>
      <h1 className="page-enter">{t('cabinetDeDessin')}</h1>

      <div className="mt-4">
        {content.length === 0 ? (
          <p className="text-[13px] text-[var(--muted)] font-light">À venir.</p>
        ) : (
          <ContentBlocksRenderer content={content} />
        )}
      </div>
    </div>
  )
}
