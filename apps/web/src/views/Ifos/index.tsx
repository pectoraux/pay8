import { SubMenuItems } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useRouter } from 'next/router'
import Hero from './components/Hero'
import IfoProvider from './contexts/IfoContext'

export const IfoPageLayout = ({ children }) => {
  const { t } = useTranslation()
  const router = useRouter()
  const isExact = router.route === '/profileAuctions'

  return (
    <IfoProvider>
      <SubMenuItems
        items={[
          {
            label: t('Latest'),
            href: '/profileAuctions',
          },
          {
            label: t('Finished'),
            href: '/profileAuctions/history',
          },
        ]}
        activeItem={isExact ? '/profileAuctions' : '/profileAuctions/history'}
      />
      <Hero />
      {children}
    </IfoProvider>
  )
}
