import { useEffect, useState } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { getPancakeProfileAddress } from 'utils/addressHelpers'
import { useToast } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { zeroAddress } from 'viem'

const useGetProfileCosts = () => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(true)
  const [costs, setCosts] = useState({
    numberCakeToReactivate: zeroAddress,
    numberCakeToRegister: zeroAddress,
    numberCakeToUpdate: zeroAddress,
  })
  const { toastError } = useToast()

  useEffect(() => {
    const fetchCosts = async () => {
      try {
        const calls = ['numberCakeToReactivate', 'numberCakeToRegister', 'numberCakeToUpdate'].map((method) => ({
          address: getPancakeProfileAddress(),
          name: method,
        }))
        // const [[numberCakeToReactivate], [numberCakeToRegister], [numberCakeToUpdate]] = await multicallv2<
        //   [[BigNumber], [BigNumber], [BigNumber]]
        // >({ abi: profileABI, calls })

        // setCosts({
        //   numberCakeToReactivate,
        //   numberCakeToRegister,
        //   numberCakeToUpdate,
        // })
        setIsLoading(false)
      } catch (error) {
        toastError(t('Error'), t('Could not retrieve CAKE costs for profile'))
      }
    }

    fetchCosts()
  }, [setCosts, toastError, t])

  return { costs, isLoading }
}

export default useGetProfileCosts
