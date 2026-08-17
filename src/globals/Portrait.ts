import type { Field, GlobalConfig } from 'payload'
import { PortraitArtworkRowBlock } from '../blocks/PortraitArtworkRowBlock'
import { TextRowBlock } from '../blocks/TextRowBlock'

const contentField: Field = {
  name: 'content',
  type: 'blocks',
  label: 'Contenu',
  blocks: [PortraitArtworkRowBlock, TextRowBlock],
}

export const Portrait: GlobalConfig = {
  slug: 'portrait',
  label: 'Portrait',
  fields: [
    { name: 'classique', type: 'group', label: 'Classique', fields: [contentField] },
    { name: 'contemporain', type: 'group', label: 'Contemporain', fields: [contentField] },
    { name: 'abstrait', type: 'group', label: 'Abstrait', fields: [contentField] },
  ],
}
