'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'

type NavChild = { href: string; labelKey: 'classique' | 'contemporain' | 'abstrait' }
type NavItem = {
  href: string
  labelKey: 'accueil' | 'portrait' | 'peintureAbstrait' | 'cabinetDeDessin' | 'biographie' | 'contact'
  children?: NavChild[]
}

const navConfig: NavItem[] = [
  { href: '', labelKey: 'accueil' },
  {
    href: '/portrait',
    labelKey: 'portrait',
    children: [
      { href: '/portrait#classique', labelKey: 'classique' },
      { href: '/portrait#contemporain', labelKey: 'contemporain' },
      { href: '/portrait#abstrait', labelKey: 'abstrait' },
    ],
  },
  { href: '/peinture-abstrait', labelKey: 'peintureAbstrait' },
  { href: '/cabinet-de-dessin', labelKey: 'cabinetDeDessin' },
  { href: '/biographie', labelKey: 'biographie' },
  { href: '/contact', labelKey: 'contact' },
]

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="8"
      height="8"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className={`transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
    >
      <polyline points="9 6 15 12 9 18" />
    </svg>
  )
}

export function Header() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [portraitOpen, setPortraitOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isHome = pathname === `/${locale}`
  const otherLocale = locale === 'fr' ? 'en' : 'fr'
  const switchPath = pathname.replace(`/${locale}`, `/${otherLocale}`)

  const navItem = (href: string, label: string, key?: string) => (
    <Link
      key={key}
      href={`/${locale}${href}`}
      className="nav-link text-[11px] font-extralight tracking-[0.18em] uppercase text-[var(--ink)] hover:text-[var(--brand)] transition-colors"
    >
      {label}
    </Link>
  )

  return (
    <header className="contents">
      {/* Desktop vertical sidebar */}
      <div
        className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-60 lg:z-50 lg:justify-between lg:px-10 lg:py-12 lg:bg-[var(--bg)] lg:border-r lg:border-[var(--border)] transition-opacity duration-300 ${
          isHome ? 'opacity-45 hover:opacity-100' : 'opacity-100'
        }`}
      >
        <nav className="flex flex-col gap-6">
          {navConfig.map((item) =>
            item.children ? (
              <div key={item.href}>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/${locale}${item.href}`}
                    className="nav-link text-[11px] font-extralight tracking-[0.18em] uppercase text-[var(--ink)] hover:text-[var(--brand)] transition-colors"
                  >
                    {t(item.labelKey)}
                  </Link>
                  <button
                    type="button"
                    onClick={() => setPortraitOpen((v) => !v)}
                    aria-expanded={portraitOpen}
                    aria-controls="portrait-submenu"
                    aria-label={portraitOpen ? 'Réduire' : 'Développer'}
                    className="text-[var(--muted)] hover:text-[var(--brand)] transition-colors p-1 -m-1"
                  >
                    <Chevron open={portraitOpen} />
                  </button>
                </div>
                {portraitOpen && (
                  <div
                    id="portrait-submenu"
                    className="flex flex-col gap-2.5 pl-3 border-l border-[var(--border)] mt-3"
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={`/${locale}${child.href}`}
                        className="nav-link text-[10px] font-extralight tracking-[0.18em] normal-case text-[var(--muted)] hover:text-[var(--brand)] transition-colors"
                      >
                        {t(child.labelKey)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              navItem(item.href, t(item.labelKey), item.href)
            )
          )}
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
        <div className="flex justify-end items-center px-6 md:px-10 py-5">
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
            {navConfig.map((item) =>
              item.children ? (
                <div key={item.href} className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/${locale}${item.href}`}
                      className="text-[11px] font-extralight tracking-[0.18em] uppercase text-[var(--ink)] hover:text-[var(--brand)] transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {t(item.labelKey)}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setPortraitOpen((v) => !v)}
                      aria-expanded={portraitOpen}
                      aria-label={portraitOpen ? 'Réduire' : 'Développer'}
                      className="text-[var(--muted)] hover:text-[var(--brand)] transition-colors p-1 -m-1"
                    >
                      <Chevron open={portraitOpen} />
                    </button>
                  </div>
                  {portraitOpen && (
                    <div className="flex flex-col gap-4 pl-3 border-l border-[var(--border)]">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={`/${locale}${child.href}`}
                          className="text-[10px] font-extralight tracking-[0.18em] normal-case text-[var(--muted)] hover:text-[var(--brand)] transition-colors"
                          onClick={() => setMobileOpen(false)}
                        >
                          {t(child.labelKey)}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={`/${locale}${item.href}`}
                  className="text-[11px] font-extralight tracking-[0.18em] uppercase text-[var(--ink)] hover:text-[var(--brand)] transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {t(item.labelKey)}
                </Link>
              )
            )}
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
