import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'

export default async function ActualiteDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const payload = await getPayload({ config: configPromise })

  const result = await payload
    .find({
      collection: 'news',
      where: { or: [{ slug: { equals: slug } }, { id: { equals: slug } }] },
      locale: locale as 'fr' | 'en',
      depth: 2,
      limit: 1,
    })
    .catch(() => null)

  const item = result?.docs?.[0]
  if (!item) notFound()

  const publishDate = item.publishedAt
    ? new Date(item.publishedAt).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''

  return (
    <article>
      <div className="page-enter">
        {publishDate && (
          <p className="text-[10px] font-extralight tracking-[0.16em] uppercase text-[var(--muted)] mb-4">
            {publishDate}
          </p>
        )}
        <h1>{item.title}</h1>
      </div>

      {item.content && (
        <div className="page-enter-1 prose-parissa">
          <RichText
            data={item.content}
            converters={({ defaultConverters }) => ({
              ...defaultConverters,
              blocks: {
                videoBlock: ({ node }: { node: { fields: Record<string, unknown> } }) => {
                  const { video, caption } = node.fields as {
                    video?: { url?: string }
                    caption?: string
                  }
                  if (!video?.url) return null
                  return (
                    <figure className="my-8">
                      <video
                        src={video.url}
                        controls
                        className="w-full"
                        style={{ maxHeight: '480px' }}
                      />
                      {caption && (
                        <figcaption className="text-[11px] text-[var(--muted)] mt-2 italic">
                          {caption}
                        </figcaption>
                      )}
                    </figure>
                  )
                },
              },
            })}
          />
        </div>
      )}
    </article>
  )
}
