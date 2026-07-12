import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { RichText } from '@payloadcms/richtext-lexical/react'

export default async function BiographiePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const payload = await getPayload({ config: configPromise })

  const bio = await payload.findGlobal({
    slug: 'biography',
    locale: locale as 'fr' | 'en',
  }).catch(() => null)

  return (
    <div className="max-w-xl">
      <h1 className="page-enter">Biographie</h1>
      {bio?.content ? (
        <div className="page-enter-1 prose-parissa">
          <RichText data={bio.content} />
        </div>
      ) : (
        <p className="text-[13px] text-[var(--muted)] font-light">Contenu à venir.</p>
      )}
    </div>
  )
}
