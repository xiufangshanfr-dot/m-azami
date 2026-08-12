import type { Block } from 'payload'

export const ArtworkRowBlock: Block = {
  slug: 'artworkRow',
  labels: { singular: "Ligne d'œuvres", plural: "Lignes d'œuvres" },
  fields: [
    {
      name: 'itemCount',
      type: 'number',
      label: "Nombre total d'œuvres de cette ligne",
      required: true,
      min: 1,
      max: 6,
      admin: {
        description: "Définissez ce nombre AVANT d'ajouter les œuvres ci-dessous.",
      },
    },
    {
      name: 'items',
      type: 'array',
      label: 'Œuvres',
      labels: { singular: 'Œuvre', plural: 'Œuvres' },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true, label: 'Image' },
        { name: 'title', type: 'text', required: true, localized: true, maxLength: 100, label: 'Titre' },
        { name: 'creationDate', type: 'text', label: 'Date de création' },
      ],
      validate: (value, { siblingData }) => {
        const expected = (siblingData as { itemCount?: number })?.itemCount
        const actual = Array.isArray(value) ? value.length : 0
        if (typeof expected !== 'number') return true
        if (actual !== expected) {
          return `Cette ligne doit contenir exactement ${expected} œuvre(s) (actuellement ${actual}).`
        }
        return true
      },
    },
  ],
}
