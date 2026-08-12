import type { Block } from 'payload'

export const TextRowBlock: Block = {
  slug: 'textRow',
  labels: { singular: 'Bloc de texte', plural: 'Blocs de texte' },
  fields: [
    { name: 'content', type: 'richText', required: true, localized: true, label: 'Texte' },
  ],
}
