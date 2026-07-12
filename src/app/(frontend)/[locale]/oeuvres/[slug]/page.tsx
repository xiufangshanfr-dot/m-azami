import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'works',
    where: { slug: { equals: slug } },
    locale: locale as 'fr' | 'en',
    limit: 1,
  }).catch(() => null)

  const work = result?.docs?.[0]
  if (!work) notFound()

  const image = typeof work.image === 'object' ? work.image : null
  const backHref = `/${locale}/oeuvres/${work.type === 'peinture' ? 'peintures' : 'sculptures'}`

  return (
    <article className="max-w-3xl">
      {/* Back */}
      <div className="page-enter mb-8">
        <Link
          href={backHref}
          className="nav-link text-[10px] font-extralight tracking-[0.16em] uppercase text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
        >
          ← Retour
        </Link>
      </div>

      {/* Title */}
      <div className="page-enter-1">
        <h1>{work.title}</h1>
      </div>

      {/* Image */}
      {image && (
        <div className="page-enter-2 mt-2">
          <Image
            src={(image as { url: string }).url}
            alt={work.title}
            width={800}
            height={900}
            className="w-full object-contain max-h-[80vh]"
          />
        </div>
      )}

      {/* Description */}
      {work.description && (
        <p className="page-enter-3 mt-5 text-[12px] font-light italic text-[var(--muted)] tracking-wide">
          {work.description}
        </p>
      )}
    </article>
  )
}
