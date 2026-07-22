'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'

export function Header() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const [oeuvresOpen, setOeuvresOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const otherLocale = locale === 'fr' ? 'en' : 'fr'
  const switchPath = pathname.replace(`/${locale}`, `/${otherLocale}`)

  const navItem = (href: string, label: string) => (
    <Link
      href={`/${locale}${href}`}
      className="nav-link text-[11px] font-extralight tracking-[0.18em] uppercase text-[var(--ink)] hover:text-[var(--brand)] transition-colors"
    >
      {label}
    </Link>
  )

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#fffbf7]/96 backdrop-blur-md border-b border-[var(--border)]'
          : ''
      }`}
    >
      <div className="flex justify-between items-center px-6 md:px-10 lg:px-20 py-5">

        {/* Brand */}
        <Link href={`/${locale}`}>
          <span className="font-garamond text-[1.35rem] text-[var(--brand)] uppercase tracking-[0.22em] hover:opacity-60 transition-opacity duration-300 select-none">
            MORY AZAMI
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-9">
          {navItem('/actualites', t('actualites'))}

          {/* Oeuvres dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setOeuvresOpen(true)}
            onMouseLeave={() => setOeuvresOpen(false)}
          >
            <button className="nav-link text-[11px] font-extralight tracking-[0.18em] uppercase text-[var(--ink)] hover:text-[var(--brand)] transition-colors cursor-default">
              {t('oeuvres')}
            </button>
            {oeuvresOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 min-w-[160px]">
                <div className="bg-[var(--cream)] border border-[var(--border)] py-3 px-4 shadow-sm">
                  <Link
                    href={`/${locale}/oeuvres/portrait`}
                    className="block py-1.5 text-[10px] font-extralight tracking-[0.18em] normal-case text-[var(--ink)] hover:text-[var(--brand)] transition-colors nav-link"
                  >
                    {t('portrait')}
                  </Link>
                  <Link
                    href={`/${locale}/oeuvres/abstrait-figuratif`}
                    className="block py-1.5 text-[10px] font-extralight tracking-[0.18em] normal-case text-[var(--ink)] hover:text-[var(--brand)] transition-colors nav-link"
                  >
                    {t('abstraitFiguratif')}
                  </Link>
                  <Link
                    href={`/${locale}/oeuvres/abstrait`}
                    className="block py-1.5 text-[10px] font-extralight tracking-[0.18em] normal-case text-[var(--ink)] hover:text-[var(--brand)] transition-colors nav-link"
                  >
                    {t('abstrait')}
                  </Link>
                  <Link
                    href={`/${locale}/oeuvres/divers`}
                    className="block py-1.5 text-[10px] font-extralight tracking-[0.18em] normal-case text-[var(--ink)] hover:text-[var(--brand)] transition-colors nav-link"
                  >
                    {t('divers')}
                  </Link>
                </div>
              </div>
            )}
          </div>

          {navItem('/biographie', t('biographie'))}
          {navItem('/authentification', t('authentification'))}

          {/* Separator */}
          <span className="w-px h-3 bg-[var(--border)]" />

          {/* Language */}
          <Link
            href={switchPath}
            className="text-[10px] font-extralight tracking-[0.22em] text-[var(--muted)] hover:text-[var(--ink)] transition-colors uppercase"
          >
            {otherLocale}
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-[var(--ink)] hover:text-[var(--brand)] transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <span className="flex flex-col gap-[5px] w-5">
            <span className={`block h-px bg-current transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[6px]' : ''}`} />
            <span className={`block h-px bg-current transition-opacity duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-px bg-current transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} />
          </span>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[var(--border)] bg-[var(--cream)] px-6 py-6 flex flex-col gap-5">
          {[
            ['/actualites', t('actualites')],
            ['/oeuvres/portrait', t('portrait')],
            ['/oeuvres/abstrait-figuratif', t('abstraitFiguratif')],
            ['/oeuvres/abstrait', t('abstrait')],
            ['/oeuvres/divers', t('divers')],
            ['/biographie', t('biographie')],
            ['/authentification', t('authentification')],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={`/${locale}${href}`}
              className={`text-[11px] font-extralight tracking-[0.18em] ${href.startsWith('/oeuvres/') ? 'normal-case' : 'uppercase'} text-[var(--ink)] hover:text-[var(--brand)] transition-colors`}
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link
            href={switchPath}
            className="text-[10px] font-extralight tracking-[0.22em] text-[var(--muted)] uppercase mt-2"
            onClick={() => setMobileOpen(false)}
          >
            {otherLocale}
          </Link>
        </div>
      )}
    </header>
  )
}
