interface ModuleTwoImageItem {
  image: { url: string; alt?: string } | string | null | undefined
  caption: string
  link: string
}
interface ModuleTwoData {
  title: string
  images: ModuleTwoImageItem[]
}

export function ModuleTwoBlock({ data, viewLabel }: { data: ModuleTwoData; viewLabel: string }) {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6">
      <h2>{data.title}</h2>
      <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-10">
        {data.images.map((item, i) => {
          const url = typeof item.image === 'object' && item.image ? item.image.url : null
          const alt = (typeof item.image === 'object' && item.image?.alt) || item.caption
          return (
            <div key={i} className="flex flex-col items-start">
              {url && <img src={url} alt={alt} className="prose-img" />}
              <p className="mt-3 text-[14px] md:text-[15px] font-bold text-[var(--ink)] leading-snug">
                {item.caption}
              </p>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link inline-block w-fit mt-2 text-[10px] font-extralight tracking-[0.22em] uppercase text-[var(--ink)] hover:text-[var(--brand)] transition-colors"
              >
                {viewLabel}
              </a>
            </div>
          )
        })}
      </div>
    </section>
  )
}
