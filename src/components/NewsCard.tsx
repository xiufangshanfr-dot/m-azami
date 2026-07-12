import Image from 'next/image'
import Link from 'next/link'

interface NewsCardProps {
  title: string
  coverImage: { url: string; alt?: string }
  slug: string
  locale: string
  date?: string
}

export function NewsCard({ title, coverImage, slug, locale, date }: NewsCardProps) {
  return (
    <Link href={`/${locale}/actualites/${slug}`} className="group block">
      {/* Image */}
      <div className="overflow-hidden bg-[var(--border)]">
        <Image
          src={coverImage.url}
          alt={coverImage.alt || title}
          width={411}
          height={308}
          className="w-full aspect-[411/308] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      </div>

      {/* Text */}
      <div className="mt-3 flex flex-col gap-1">
        {date && (
          <span className="text-[10px] font-extralight tracking-[0.14em] text-[var(--muted)] uppercase">
            {date}
          </span>
        )}
        <p className="text-[13px] font-light text-[var(--ink)] tracking-wide leading-snug group-hover:text-[var(--brand)] transition-colors duration-200">
          {title}
        </p>
      </div>
    </Link>
  )
}
