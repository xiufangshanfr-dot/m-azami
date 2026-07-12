import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function Footer() {
  const payload = await getPayload({ config: configPromise })
  const settings = await payload.findGlobal({ slug: 'site-settings' }).catch(() => null)

  const copyright = settings?.copyrightText || '© 2026 PARISSA'
  const instagramUrl = settings?.instagramUrl || '#'

  return (
    <footer className="px-6 md:px-10 lg:px-20 pt-16 pb-6 mt-auto border-t border-[var(--border)]">
      <div className="flex flex-row justify-between items-center">
        <p className="text-[10px] font-extralight tracking-[0.14em] text-[var(--muted)] uppercase">
          {copyright}
        </p>
        {instagramUrl && instagramUrl !== '#' && (
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-[var(--muted)] hover:text-[var(--ink)] transition-colors duration-200"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
            </svg>
          </a>
        )}
      </div>
    </footer>
  )
}
