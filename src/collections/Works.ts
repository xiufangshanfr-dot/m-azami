import type { CollectionConfig } from 'payload'

export const Works: CollectionConfig = {
  slug: 'works',
  labels: { singular: 'Œuvre', plural: 'Œuvres' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'order'],
  },
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Portrait', value: 'portrait' },
        { label: 'Abstrait figuratif', value: 'abstrait-figuratif' },
        { label: 'Abstrait', value: 'abstrait' },
        { label: 'Divers', value: 'divers' },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'description',
      type: 'text',
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'order',
      type: 'number',
      admin: { position: 'sidebar' },
    },
  ],
}
