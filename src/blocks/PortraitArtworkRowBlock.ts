import type { Block } from 'payload'

function getRichTextLength(data: unknown): number {
  const root = (data as { root?: { children?: unknown[] } })?.root
  if (!root?.children) return 0
  let length = 0
  const walk = (nodes: unknown[]) => {
    for (const node of nodes as Record<string, unknown>[]) {
      if (node.type === 'text' && typeof node.text === 'string') length += node.text.length
      if (Array.isArray(node.children)) walk(node.children)
    }
  }
  walk(root.children)
  return length
}

export const PortraitArtworkRowBlock: Block = {
  slug: 'portraitArtworkRow',
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
        {
          name: 'description',
          type: 'richText',
          localized: true,
          label: 'Description',
          validate: (value) => {
            const len = getRichTextLength(value)
            return len > 5000
              ? `La description ne doit pas dépasser 5000 caractères (actuellement ${len}).`
              : true
          },
        },
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
