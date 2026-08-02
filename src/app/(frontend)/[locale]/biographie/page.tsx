import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { RichText } from '@payloadcms/richtext-lexical/react'

type UploadDoc = { url?: string; alt?: string }
type UploadNode = {
  fields?: { alt?: string }
  value?: UploadDoc
}

export default async function BiographiePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const payload = await getPayload({ config: configPromise })

  const bio = await payload.findGlobal({
    slug: 'biography',
    locale: locale as 'fr' | 'en',
  }).catch(() => null)

  return (
    <div className="max-w-3xl">
      <h1 className="page-enter">Biographie</h1>
      {bio?.content ? (
        <div className="page-enter-1 prose-parissa">
          <RichText
            data={bio.content}
            converters={({ defaultConverters }) => ({
              ...defaultConverters,
              upload: ({ node }) => {
                const uploadNode = node as UploadNode
                if (typeof uploadNode.value !== 'object') return null
                const doc = uploadNode.value
                const url = doc?.url
                if (!url) return null
                const caption = uploadNode.fields?.alt || doc?.alt || ''

                return (
                  <figure className="prose-figure">
                    <img src={url} alt="" className="prose-img" aria-hidden="true" />
                    {caption && <figcaption className="prose-caption">{caption}</figcaption>}
                  </figure>
                )
              },
            })}
          />
        </div>
      ) : (
        <p className="text-[13px] text-[var(--muted)] font-light">Contenu à venir.</p>
      )}
    </div>
  )
}
