import type { GlobalConfig } from 'payload'
import { ModuleOne } from '../blocks/ModuleOne'
import { ModuleTwo } from '../blocks/ModuleTwo'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Page d\'accueil',
  fields: [
    {
      name: 'modules',
      type: 'blocks',
      label: 'Modules de contenu',
      blocks: [ModuleOne, ModuleTwo],
    },
  ],
}
