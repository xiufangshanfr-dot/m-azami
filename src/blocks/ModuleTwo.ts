import type { Block } from 'payload'

export const ModuleTwo: Block = {
  slug: 'moduleTwo',
  labels: { singular: 'Module 2 (Triptyque)', plural: 'Modules 2 (Triptyque)' },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true, maxLength: 100, label: 'Titre' },
    {
      name: 'images',
      type: 'array',
      label: 'Images (exactement 3)',
      minRows: 3,
      maxRows: 3,
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true, label: 'Image' },
        { name: 'caption', type: 'text', required: true, localized: true, maxLength: 100, label: 'Légende' },
        { name: 'link', type: 'text', required: true, label: 'Lien ("Voir")' },
      ],
    },
  ],
}
