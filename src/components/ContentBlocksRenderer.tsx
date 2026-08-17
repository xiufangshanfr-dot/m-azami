'use client'

import { useState } from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { Lightbox } from '@/components/Lightbox'

interface ArtworkItem {
  image: { url: string; alt?: string } | string | null | undefined
  title: string
  creationDate?: string | null
}

interface ArtworkRowBlockData {
  blockType: 'artworkRow'
  id?: string
  itemCount: number
  items: ArtworkItem[]
}

interface PortraitArtworkItem {
  image: { url: string; alt?: string } | string | null | undefined
  title: string
  creationDate?: string | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  description?: any
}

interface PortraitArtworkRowBlockData {
  blockType: 'portraitArtworkRow'
  id?: string
  itemCount: number
  items: PortraitArtworkItem[]
}

interface TextRowBlockData {
  blockType: 'textRow'
  id?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any
}

export type ContentBlockData = ArtworkRowBlockData | PortraitArtworkRowBlockData | TextRowBlockData

type UploadDoc = { url?: string; alt?: string }
type UploadNode = { fields?: { alt?: string }; value?: UploadDoc }

const GRID_COLS: Record<number, string> = {
  1: 'grid-cols-1 max-w-sm',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-2 lg:grid-cols-4',
  5: 'grid-cols-2 lg:grid-cols-5',
  6: 'grid-cols-2 lg:grid-cols-6',
}

export function ContentBlocksRenderer({ content }: { content: ContentBlockData[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const flatItems = content
    .filter(
      (block): block is ArtworkRowBlockData | PortraitArtworkRowBlockData =>
        block.blockType === 'artworkRow' || block.blockType === 'portraitArtworkRow'
    )
    .flatMap((block) => block.items)
    .filter((item) => typeof item.image === 'object' && item.image)

  let flatOffset = 0

  return (
    <>
      <div className="page-enter-1 flex flex-col gap-16">
        {content.map((block, blockIndex) => {
          if (block.blockType === 'artworkRow') {
            const items = block.items.filter((item) => typeof item.image === 'object' && item.image)
            const startIndex = flatOffset
            flatOffset += items.length
            const cols = GRID_COLS[items.length] ?? GRID_COLS[3]

            return (
              <div key={block.id ?? blockIndex} className={`grid ${cols} gap-x-6 gap-y-10`}>
                {items.map((item, i) => {
                  const url = (item.image as { url: string }).url
                  const alt = (item.image as { alt?: string }).alt || item.title
                  return (
                    <button
                      key={i}
                      onClick={() => setActiveIndex(startIndex + i)}
                      className="group block text-left"
                    >
                      <img
                        src={url}
                        alt={alt}
                        className="prose-img transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                      />
                      <div className="mt-2.5">
                        <p className="text-[11px] font-light text-[var(--ink)] tracking-wide">{item.title}</p>
                        {item.creationDate && (
                          <p className="text-[11px] font-light italic text-[var(--muted)] mt-0.5 leading-snug">
                            {item.creationDate}
                          </p>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            )
          }

          if (block.blockType === 'portraitArtworkRow') {
            const items = block.items.filter((item) => typeof item.image === 'object' && item.image)
            const startIndex = flatOffset
            flatOffset += items.length

            return (
              <div key={block.id ?? blockIndex} className="flex flex-col gap-16">
                {items.map((item, i) => {
                  const url = (item.image as { url: string }).url
                  const alt = (item.image as { alt?: string }).alt || item.title
                  return (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row items-center gap-8 sm:gap-12 p-6 md:p-10"
                    >
                      <button
                        onClick={() => setActiveIndex(startIndex + i)}
                        className="group shrink-0 w-full sm:w-1/2"
                      >
                        <img
                          src={url}
                          alt={alt}
                          className="prose-img transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                        />
                      </button>
                      <div className="w-full sm:w-1/2 flex flex-col justify-center text-center sm:text-left">
                        <p className="text-[11px] font-light text-[var(--ink)] tracking-wide">{item.title}</p>
                        {item.creationDate && (
                          <p className="text-[11px] font-light italic text-[var(--muted)] mt-0.5 leading-snug">
                            {item.creationDate}
                          </p>
                        )}
                        {item.description && (
                          <div className="prose-parissa mt-3">
                            <RichText data={item.description} />
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          }

          return (
            <div key={block.id ?? blockIndex} className="prose-parissa my-4">
              <RichText
                data={block.content}
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
          )
        })}
      </div>

      {activeIndex !== null && (
        <Lightbox
          images={flatItems.map((item) => ({
            url: (item.image as { url: string }).url,
            alt: (item.image as { alt?: string }).alt || item.title,
            title: item.title,
            description: item.creationDate ?? undefined,
          }))}
          index={activeIndex}
          onClose={() => setActiveIndex(null)}
          onNavigate={setActiveIndex}
        />
      )}
    </>
  )
}
