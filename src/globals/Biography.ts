import type { GlobalConfig } from 'payload'

export const Biography: GlobalConfig = {
  slug: 'biography',
  label: 'Biographie',
  fields: [
    {
      name: 'content',
      type: 'richText',
      label: 'Contenu',
      localized: true,
    },
  ],
}
