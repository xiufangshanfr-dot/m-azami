import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Paramètres du site',
  fields: [
    {
      name: 'siteName',
      type: 'text',
      label: 'Nom du site',
      defaultValue: 'PARISSA',
    },
    {
      name: 'copyrightText',
      type: 'text',
      label: 'Texte de copyright',
      defaultValue: '© 2026 PARISSA',
    },
    {
      name: 'instagramUrl',
      type: 'text',
      label: 'Lien Instagram',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo / Signature',
    },
  ],
}
