import Image from 'next/image'
import Link from 'next/link'

interface WorkCardProps {
  title: string
  description?: string
  image: { url: string; alt?: string }
  slug: string
  locale: string
}

export function WorkCard({ title, description, image, slug, locale }: WorkCardProps) {
  return (
    <Link href={`/${locale}/oeuvres/${slug}`} className="group block">
      {/* Image */}
      <div className="overflow-hidden bg-[var(--border)]">
        <Image
          src={image.url}
          alt={image.alt || title}
          width={380}
          height={430}
          className="w-full aspect-[380/430] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      </div>

      {/* Caption */}
      <div className="mt-2.5">
        <p className="text-[11px] font-light text-[var(--ink)] tracking-wide">
          {title}
        </p>
        {description && (
          <p className="text-[11px] font-light italic text-[var(--muted)] mt-0.5 leading-snug">
            {description}
          </p>
        )}
      </div>
    </Link>
  )
}
