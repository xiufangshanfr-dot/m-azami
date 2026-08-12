import { getPayload } from 'payload'
import { getTranslations } from 'next-intl/server'
import configPromise from '@payload-config'
import { ContentBlocksRenderer, type ContentBlockData } from '@/components/ContentBlocksRenderer'

export default async function PortraitPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const payload = await getPayload({ config: configPromise })
  const t = await getTranslations({ locale, namespace: 'nav' })

  const data = await payload
    .findGlobal({ slug: 'portrait', locale: locale as 'fr' | 'en' })
    .catch(() => null)

  const sections: { id: string; label: string; content: ContentBlockData[] }[] = [
    { id: 'classique', label: t('classique'), content: (data?.classique?.content ?? []) as ContentBlockData[] },
    { id: 'contemporain', label: t('contemporain'), content: (data?.contemporain?.content ?? []) as ContentBlockData[] },
    { id: 'abstrait', label: t('abstrait'), content: (data?.abstrait?.content ?? []) as ContentBlockData[] },
  ]

  return (
    <div>
      <h1 className="page-enter">{t('portrait')}</h1>

      <div className="page-enter-1 flex flex-col gap-20 mt-4">
        {sections.map((section) => (
          <section key={section.id} id={section.id}>
            <h2>{section.label}</h2>
            {section.content.length === 0 ? (
              <p className="text-[13px] text-[var(--muted)] font-light">À venir.</p>
            ) : (
              <ContentBlocksRenderer content={section.content} />
            )}
          </section>
        ))}
      </div>
    </div>
  )
}
