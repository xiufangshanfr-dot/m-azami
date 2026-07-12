import type { CollectionConfig } from 'payload'

export const Messages: CollectionConfig = {
  slug: 'messages',
  labels: { singular: 'Message', plural: 'Messages' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'status', 'receivedAt'],
  },
  access: {
    create: () => true,
    read: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'content', type: 'textarea', required: true },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'unprocessed',
      options: [
        { label: 'Non traité', value: 'unprocessed' },
        { label: 'Traité', value: 'processed' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'receivedAt',
      type: 'date',
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create') {
          return { ...data, receivedAt: new Date().toISOString() }
        }
        return data
      },
    ],
  },
}
