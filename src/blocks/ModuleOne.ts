import type { Block } from 'payload'

export const ModuleOne: Block = {
  slug: 'moduleOne',
  labels: { singular: 'Module 1 (Image + titre)', plural: 'Modules 1 (Image + titre)' },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true, maxLength: 100, label: 'Titre' },
    { name: 'image', type: 'upload', relationTo: 'media', required: true, label: 'Image' },
    { name: 'link', type: 'text', required: true, label: 'Lien ("Voir")' },
  ],
}
