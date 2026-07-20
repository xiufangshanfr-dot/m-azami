import { buildConfig } from 'payload'
import type { Block } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import {
  lexicalEditor,
  BoldFeature,
  ItalicFeature,
  UnderlineFeature,
  StrikethroughFeature,
  ParagraphFeature,
  HeadingFeature,
  LinkFeature,
  OrderedListFeature,
  UnorderedListFeature,
  BlockquoteFeature,
  BlocksFeature,
  UploadFeature,
  HorizontalRuleFeature,
  AlignFeature,
} from '@payloadcms/richtext-lexical'

const VideoBlock: Block = {
  slug: 'videoBlock',
  labels: { singular: 'Vidéo', plural: 'Vidéos' },
  fields: [
    {
      name: 'video',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Fichier vidéo',
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Légende (optionnel)',
    },
  ],
}
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'
import { Media } from './collections/Media'
import { News } from './collections/News'
import { Works } from './collections/Works'
import { Messages } from './collections/Messages'
import { Homepage } from './globals/Homepage'
import { Biography } from './globals/Biography'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '— MORY AZAMI Admin',
    },
    suppressHydrationWarning: true,
  },
  collections: [
    Media,
    News,
    Works,
    Messages,
    {
      slug: 'users',
      auth: true,
      fields: [
        { name: 'name', type: 'text', required: true },
      ],
    },
  ],
  globals: [Homepage, Biography, SiteSettings],
  plugins: [
    vercelBlobStorage({
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
  editor: lexicalEditor({
    features: () => [
      ParagraphFeature(),
      BoldFeature(),
      ItalicFeature(),
      UnderlineFeature(),
      StrikethroughFeature(),
      HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
      BlockquoteFeature(),
      LinkFeature({}),
      OrderedListFeature(),
      UnorderedListFeature(),
      HorizontalRuleFeature(),
      AlignFeature(),
      UploadFeature({ collections: { media: { fields: [{ name: 'alt', type: 'text' }] } } }),
      BlocksFeature({ blocks: [VideoBlock] }),
    ],
  }),
  localization: {
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    fallback: true,
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
    push: true,
  }),
  upload: {
    limits: {
      fileSize: 10_000_000,
    },
  },
  sharp,
  secret: process.env.PAYLOAD_SECRET || 'parissa-secret',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
