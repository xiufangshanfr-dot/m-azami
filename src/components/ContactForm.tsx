'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

export function ContactForm() {
  const t = useTranslations('contact')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [form, setForm] = useState({ name: '', email: '', content: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed')
      setStatus('success')
      setForm({ name: '', email: '', content: '' })
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <p className="text-[13px] font-light text-[var(--muted)] tracking-wide">
        {t('success')}
      </p>
    )
  }

  const fieldClass = 'w-full bg-transparent border-b border-[var(--border)] py-2.5 text-[13px] font-light text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--ink)] transition-colors duration-200'
  const labelClass = 'block text-[10px] font-extralight tracking-[0.16em] uppercase text-[var(--muted)] mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div>
        <label className={labelClass}>{t('name')}</label>
        <input
          type="text"
          required
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          className={fieldClass}
        />
      </div>

      <div>
        <label className={labelClass}>{t('email')}</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          className={fieldClass}
        />
      </div>

      <div>
        <label className={labelClass}>{t('message')}</label>
        <textarea
          rows={5}
          value={form.content}
          onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
          className={`${fieldClass} resize-none`}
        />
      </div>

      {status === 'error' && (
        <p className="text-[11px] text-[var(--brand)] tracking-wide -mt-4">{t('error')}</p>
      )}

      <div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="relative text-[10px] font-extralight tracking-[0.22em] uppercase text-[var(--ink)] disabled:opacity-40 group"
        >
          <span className="nav-link">
            {status === 'loading' ? '···' : t('submit')}
          </span>
        </button>
      </div>
    </form>
  )
}
