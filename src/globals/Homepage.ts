import type { GlobalConfig } from 'payload'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Page d\'accueil',
  fields: [
    {
      name: 'banners',
      type: 'array',
      label: 'Bannières',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'introText',
      type: 'textarea',
      label: 'Texte d\'introduction',
      maxLength: 10000,
      localized: true,
    },
  ],
}
