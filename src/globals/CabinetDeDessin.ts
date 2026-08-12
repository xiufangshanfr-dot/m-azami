import type { GlobalConfig } from 'payload'
import { ArtworkRowBlock } from '../blocks/ArtworkRowBlock'
import { TextRowBlock } from '../blocks/TextRowBlock'

export const CabinetDeDessin: GlobalConfig = {
  slug: 'cabinet-de-dessin',
  label: 'Cabinet de dessin',
  fields: [
    {
      name: 'content',
      type: 'blocks',
      label: 'Contenu',
      blocks: [ArtworkRowBlock, TextRowBlock],
    },
  ],
}
