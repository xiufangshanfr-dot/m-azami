import { getPayload } from 'payload'
import { getTranslations } from 'next-intl/server'
import configPromise from '@payload-config'
import { ModuleOneBlock } from '@/components/ModuleOne'
import { ModuleTwoBlock } from '@/components/ModuleTwo'

type HomepageModule =
  | { blockType: 'moduleOne'; id?: string; title: string; image: { url: string; alt?: string } | string; link: string }
  | { blockType: 'moduleTwo'; id?: string; title: string; images: { image: { url: string; alt?: string } | string; caption: string; link: string }[] }

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const payload = await getPayload({ config: configPromise })
  const t = await getTranslations({ locale, namespace: 'home' })

  const data = await payload.findGlobal({
    slug: 'homepage',
    locale: locale as 'fr' | 'en',
  }).catch(() => null)

  const modules = (data?.modules ?? []) as HomepageModule[]

  return (
    <div>
      <h1 className="page-enter text-center">MORY AZAMI</h1>

      {modules.length > 0 && (
        <div className="page-enter-1 flex flex-col gap-20 mt-16">
          {modules.map((mod, i) =>
            mod.blockType === 'moduleOne' ? (
              <ModuleOneBlock key={mod.id ?? i} data={mod} viewLabel={t('view')} />
            ) : mod.blockType === 'moduleTwo' ? (
              <ModuleTwoBlock key={mod.id ?? i} data={mod} viewLabel={t('view')} />
            ) : null
          )}
        </div>
      )}
    </div>
  )
}
