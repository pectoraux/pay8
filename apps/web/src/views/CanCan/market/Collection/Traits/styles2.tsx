import styled from 'styled-components'
import { Modal, Grid, Box, Input } from '@pancakeswap/uikit'
import { LockStage } from './types'

export const StyledModal = styled(Modal)<{ stage: LockStage }>`
  & > div:last-child {
    padding: 0;
  }
`
export const stagesWithApproveButton = [LockStage.CONFIRM_FUND_REVENUE, LockStage.CONFIRM_SUPERCHAT]

export const stagesWithConfirmButton = [
  LockStage.CONFIRM_SUPERCHAT_ALL,
  LockStage.CONFIRM_WITHDRAW,
  LockStage.CONFIRM_CLAIM_REVENUE,
  LockStage.CONFIRM_CLAIM_SP_REVENUE,
  LockStage.CONFIRM_TRANSFER_DUE_RECEIVABLE,
  LockStage.CONFIRM_CLAIM_REVENUE_FROM_NOTE,
]

export const stagesWithBackButton = [
  LockStage.SUPERCHAT,
  LockStage.CONFIRM_SUPERCHAT,
  LockStage.SUPERCHAT_ALL,
  LockStage.CONFIRM_SUPERCHAT_ALL,
  LockStage.CLAIM_SP_REVENUE,
  LockStage.CONFIRM_CLAIM_SP_REVENUE,
  LockStage.CONFIRM_WITHDRAW,
  LockStage.FUND_REVENUE,
  LockStage.CLAIM_REVENUE_FROM_NOTE,
  LockStage.CONFIRM_CLAIM_REVENUE_FROM_NOTE,
  LockStage.CONFIRM_FUND_REVENUE,
  LockStage.TRANSFER_DUE_RECEIVABLE,
  LockStage.CLAIM_REVENUE,
  LockStage.CONFIRM_CLAIM_REVENUE,
  LockStage.CONFIRM_TRANSFER_DUE_RECEIVABLE,
]

export const Divider = styled.div`
  margin: 16px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
`

export const GreyedOutContainer = styled(Box)`
  background-color: ${({ theme }) => theme.colors.dropdown};
  padding: 16px;
`

export const RightAlignedInput = styled(Input)`
  text-align: right;
`

export const BorderedBox = styled(Grid)`
  margin: 16px 0;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: ${({ theme }) => theme.radii.default};
  grid-template-columns: 1fr 1fr;
  grid-row-gap: 8px;
`
