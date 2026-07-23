'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Lightbox } from '@/components/Lightbox'

interface Work {
  id: string
  title: string
  description?: string
  image: { url: string; alt?: string }
}

export function WorksGallery({ works }: { works: Work[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <>
      <div className="page-enter-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
        {works.map((work, i) => (
          <button
            key={work.id}
            onClick={() => setActiveIndex(i)}
            className="group block text-left"
          >
            <div className="overflow-hidden bg-[var(--border)]">
              <Image
                src={work.image.url}
                alt={work.image.alt || work.title}
                width={380}
                height={430}
                className="w-full aspect-[380/430] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
            </div>
            <div className="mt-2.5">
              <p className="text-[11px] font-light text-[var(--ink)] tracking-wide">{work.title}</p>
              {work.description && (
                <p className="text-[11px] font-light italic text-[var(--muted)] mt-0.5 leading-snug">
                  {work.description}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <Lightbox
          images={works.map((w) => ({
            url: w.image.url,
            alt: w.image.alt || w.title,
            title: w.title,
            description: w.description,
          }))}
          index={activeIndex}
          onClose={() => setActiveIndex(null)}
          onNavigate={setActiveIndex}
        />
      )}
    </>
  )
}
