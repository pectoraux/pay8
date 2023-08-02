import { PageMeta } from 'components/Layout/Page'
import { useAccountLocalEventListener } from 'hooks/useAccountLocalEventListener'

import CollectWinningsPopup from './components/CollectWinningsPopup'
import Container from './components/Container'
import SwiperProvider from './context/SwiperProvider'
import Desktop from './Desktop'

const Bettings = ({ allBettings }) => {
  useAccountLocalEventListener()
  return (
    <>
      <PageMeta />
      <SwiperProvider>
        <Container>
          <Desktop allBettings={allBettings} />
          <CollectWinningsPopup />
        </Container>
      </SwiperProvider>
    </>
  )
}

export default Bettings
