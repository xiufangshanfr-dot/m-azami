'use client'

import { useEffect } from 'react'
import Image from 'next/image'

interface LightboxImage {
  url: string
  alt: string
  title: string
  description?: string
}

interface LightboxProps {
  images: LightboxImage[]
  index: number
  onClose: () => void
  onNavigate: (index: number) => void
}

export function Lightbox({ images, index, onClose, onNavigate }: LightboxProps) {
  const image = images[index]
  const hasPrev = index > 0
  const hasNext = index < images.length - 1

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && hasPrev) onNavigate(index - 1)
      if (e.key === 'ArrowRight' && hasNext) onNavigate(index + 1)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [index, hasPrev, hasNext, onClose, onNavigate])

  if (!image) return null

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        aria-label="Fermer"
        className="absolute top-5 right-5 md:top-8 md:right-8 text-white/70 hover:text-white transition-colors z-10"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <line x1="4" y1="4" x2="20" y2="20" />
          <line x1="20" y1="4" x2="4" y2="20" />
        </svg>
      </button>

      {/* Image + hover arrows */}
      <div
        className="group relative w-full h-full flex items-center justify-center px-4 md:px-20 py-16"
        onClick={(e) => e.stopPropagation()}
      >
        {hasPrev && (
          <button
            onClick={() => onNavigate(index - 1)}
            aria-label="Image précédente"
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 text-white/0 group-hover:text-white/80 hover:!text-white transition-colors duration-300 p-2 z-10"
          >
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        <div className="relative max-w-full max-h-full flex flex-col items-center">
          <Image
            src={image.url}
            alt={image.alt || image.title}
            width={1200}
            height={1350}
            className="w-auto h-auto max-w-full max-h-[78vh] object-contain select-none"
            priority
          />
          {(image.title || image.description) && (
            <div className="mt-4 text-center">
              {image.title && (
                <p className="text-[12px] font-light tracking-wide text-white/90">{image.title}</p>
              )}
              {image.description && (
                <p className="text-[11px] font-light italic text-white/60 mt-1">{image.description}</p>
              )}
            </div>
          )}
        </div>

        {hasNext && (
          <button
            onClick={() => onNavigate(index + 1)}
            aria-label="Image suivante"
            className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 text-white/0 group-hover:text-white/80 hover:!text-white transition-colors duration-300 p-2 z-10"
          >
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
