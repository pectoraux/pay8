import { useSousChef } from 'hooks/useContract'
import { useGasPrice } from 'state/user/hooks'

const sousEmergencyUnstake = (sousChefContract: any, gasPrice: string) => {
  return sousChefContract.emergencyWithdraw({ gasPrice })
}

const useUnstakePool = (sousId: number, enableEmergencyWithdraw = false) => {
  const sousChefContract = useSousChef(sousId)
  const gasPrice = useGasPrice()

  // const handleUnstake = useCallback(
  //   async (amount: string, decimals: number) => {
  //     if (enableEmergencyWithdraw) {
  //       return sousEmergencyUnstake(sousChefContract, gasPrice)
  //     }

  //     return sousUnstake(sousChefContract, amount, decimals, gasPrice)
  //   },
  //   [enableEmergencyWithdraw, sousChefContract, gasPrice],
  // )

  return { onUnstake: () => {} }
}

export default useUnstakePool
