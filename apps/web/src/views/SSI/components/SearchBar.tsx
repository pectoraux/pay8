import { useTranslation } from '@pancakeswap/localization'
import AddressInputSelect from 'components/AddressInputSelect'
import { useRouter } from 'next/router'

const SearchBar: React.FC<any> = (props) => {
  const router = useRouter()
  const { t } = useTranslation()
  const handleAddressClick = (value: string) => {
    router.push(`/profile/${value}`)
  }

  return <AddressInputSelect placeholder={t('search searchable data')} onAddressClick={handleAddressClick} {...props} />
}

export default SearchBar
