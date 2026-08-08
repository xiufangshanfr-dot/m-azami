'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'

export function Header() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isHome = pathname === `/${locale}`
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

  const mobileItems: [string, string][] = [
    ['/oeuvres/portrait', t('portrait')],
    ['/oeuvres/abstrait-figuratif', t('abstraitFiguratif')],
    ['/oeuvres/abstrait', t('abstrait')],
    ['/oeuvres/divers', t('divers')],
    ['/biographie', t('biographie')],
    ['/authentification', t('authentification')],
  ]

  return (
    <header className="contents">
      {/* Desktop vertical sidebar */}
      <div
        className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-60 lg:z-50 lg:justify-between lg:px-10 lg:py-12 lg:bg-[var(--bg)] lg:border-r lg:border-[var(--border)] transition-opacity duration-300 ${
          isHome ? 'opacity-45 hover:opacity-100' : 'opacity-100'
        }`}
      >
        <Link href={`/${locale}`}>
          <span className="font-garamond text-[1.15rem] text-[var(--brand)] uppercase tracking-[0.2em] hover:opacity-60 transition-opacity duration-300 select-none block">
            MORY AZAMI
          </span>
        </Link>

        <nav className="flex flex-col gap-6">
          <div>
            <span className="block text-[11px] font-extralight tracking-[0.18em] uppercase text-[var(--ink)] mb-3">
              {t('oeuvres')}
            </span>
            <div className="flex flex-col gap-2.5 pl-3 border-l border-[var(--border)]">
              <Link
                href={`/${locale}/oeuvres/portrait`}
                className="nav-link text-[10px] font-extralight tracking-[0.18em] normal-case text-[var(--muted)] hover:text-[var(--brand)] transition-colors"
              >
                {t('portrait')}
              </Link>
              <Link
                href={`/${locale}/oeuvres/abstrait-figuratif`}
                className="nav-link text-[10px] font-extralight tracking-[0.18em] normal-case text-[var(--muted)] hover:text-[var(--brand)] transition-colors"
              >
                {t('abstraitFiguratif')}
              </Link>
              <Link
                href={`/${locale}/oeuvres/abstrait`}
                className="nav-link text-[10px] font-extralight tracking-[0.18em] normal-case text-[var(--muted)] hover:text-[var(--brand)] transition-colors"
              >
                {t('abstrait')}
              </Link>
              <Link
                href={`/${locale}/oeuvres/divers`}
                className="nav-link text-[10px] font-extralight tracking-[0.18em] normal-case text-[var(--muted)] hover:text-[var(--brand)] transition-colors"
              >
                {t('divers')}
              </Link>
            </div>
          </div>

          {navItem('/biographie', t('biographie'))}
          {navItem('/authentification', t('authentification'))}
        </nav>

        <Link
          href={switchPath}
          className="text-[10px] font-extralight tracking-[0.22em] text-[var(--muted)] hover:text-[var(--ink)] transition-colors uppercase"
        >
          {otherLocale}
        </Link>
      </div>

      {/* Mobile top bar */}
      <div
        className={`lg:hidden fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-[#ffffff]/96 backdrop-blur-md border-b border-[var(--border)]' : ''
        }`}
      >
        <div className="flex justify-between items-center px-6 md:px-10 py-5">
          <Link href={`/${locale}`}>
            <span className="font-garamond text-[1.35rem] text-[var(--brand)] uppercase tracking-[0.22em] hover:opacity-60 transition-opacity duration-300 select-none">
              MORY AZAMI
            </span>
          </Link>

          <button
            className="text-[var(--ink)] hover:text-[var(--brand)] transition-colors"
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

        {mobileOpen && (
          <div className="border-t border-[var(--border)] bg-[var(--bg)] px-6 py-6 flex flex-col gap-5">
            {mobileItems.map(([href, label]) => (
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
      </div>
    </header>
  )
}
