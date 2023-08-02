import { useState } from 'react'

const useIsRefundable = (epoch: number) => {
  const [isRefundable, setIsRefundable] = useState(false)

  return { isRefundable, setIsRefundable }
}

export default useIsRefundable
