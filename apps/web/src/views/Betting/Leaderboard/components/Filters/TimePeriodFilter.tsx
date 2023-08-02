import { ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import useLocalDispatch from 'contexts/LocalRedux/useLocalDispatch'

const TimePeriodFilter = () => {
  const { t } = useTranslation()
  const timePeriod = '1d'
  const dispatch = useLocalDispatch()

  const timePeriodOptions = [
    { label: t('%num%d', { num: 1 }), value: '1d' },
    { label: t('%num%d', { num: 7 }), value: '7d' },
    { label: t('%num%m', { num: 1 }), value: '1m' },
    { label: t('All'), value: 'all' },
  ]
  const activeIndex = timePeriodOptions.findIndex(({ value }) => value === timePeriod)

  const handleSetTimePeriod = (newIndex: number) => {
    // dispatch(setLeaderboardFilter({ timePeriod: timePeriodOptions[newIndex].value }))
  }

  return (
    <ButtonMenu scale="sm" variant="subtle" activeIndex={activeIndex} onItemClick={handleSetTimePeriod} fullWidth>
      {timePeriodOptions.map(({ label, value }) => (
        <ButtonMenuItem key={value}>{label.toUpperCase()}</ButtonMenuItem>
      ))}
    </ButtonMenu>
  )
}

export default TimePeriodFilter