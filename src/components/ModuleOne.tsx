interface ModuleOneData {
  title: string
  image: { url: string; alt?: string } | string | null | undefined
  link: string
}

export function ModuleOneBlock({ data, viewLabel }: { data: ModuleOneData; viewLabel: string }) {
  const imageUrl = typeof data.image === 'object' && data.image ? data.image.url : null
  const imageAlt = (typeof data.image === 'object' && data.image?.alt) || data.title

  return (
    <section className="max-w-2xl mx-auto px-4 sm:px-6">
      <h2 className="font-bold">{data.title}</h2>
      {imageUrl && (
        <div className="my-6 md:my-8">
          <img src={imageUrl} alt={imageAlt} className="prose-img" />
        </div>
      )}
      <a
        href={data.link}
        target="_blank"
        rel="noopener noreferrer"
        className="nav-link inline-block w-fit text-[10px] font-extralight tracking-[0.22em] uppercase text-[var(--ink)] hover:text-[var(--brand)] transition-colors"
      >
        {viewLabel}
      </a>
    </section>
  )
}
