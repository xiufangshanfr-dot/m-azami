import type { GlobalConfig } from 'payload'
import { ArtworkRowBlock } from '../blocks/ArtworkRowBlock'
import { TextRowBlock } from '../blocks/TextRowBlock'

export const PeintureAbstrait: GlobalConfig = {
  slug: 'peinture-abstrait',
  label: 'Peinture abstrait',
  fields: [
    {
      name: 'content',
      type: 'blocks',
      label: 'Contenu',
      blocks: [ArtworkRowBlock, TextRowBlock],
    },
  ],
}
