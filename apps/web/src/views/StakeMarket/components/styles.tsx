import styled from 'styled-components'
import { Modal, Grid, Box, Input } from '@pancakeswap/uikit'
import { LockStage } from './types'

export const StyledModal = styled(Modal)<{ stage: LockStage }>`
  & > div:last-child {
    padding: 0;
  }
`

export const stagesWithApproveButton = [LockStage.CONFIRM_DEPOSIT]

export const stagesWithConfirmButton = [
  LockStage.CONFIRM_APPLY,
  LockStage.CONFIRM_WITHDRAW,
  LockStage.CONFIRM_UPDATE_OWNER,
  LockStage.CONFIRM_CLAIM_NOTE,
  LockStage.CONFIRM_UPDATE_STAKE,
  LockStage.CONFIRM_UPDATE_STAKE2,
  LockStage.CONFIRM_UPDATE_TAX_CONTRACT,
  LockStage.CONFIRM_UPDATE_BEFORE_LITIGATIONS,
  LockStage.CONFIRM_UPDATE,
  LockStage.CONFIRM_SWITCH_STAKE,
  LockStage.CONFIRM_CANCEL_STAKE,
  LockStage.CONFIRM_CANCEL_APPLICATION,
  LockStage.CONFIRM_MINT_NOTE,
  LockStage.CONFIRM_MINT_IOU,
  LockStage.CONFIRM_ACCEPT,
  LockStage.CONFIRM_UPDATE_LOCATION,
  LockStage.CONFIRM_START_WAITING_PERIOD,
]

export const stagesWithBackButton = [
  LockStage.START_WAITING_PERIOD,
  LockStage.CONFIRM_START_WAITING_PERIOD,
  LockStage.UPDATE_LOCATION,
  LockStage.CONFIRM_UPDATE_LOCATION,
  LockStage.ACCEPT,
  LockStage.CONFIRM_ACCEPT,
  LockStage.APPLY,
  LockStage.DEPOSIT,
  LockStage.UPDATE,
  LockStage.SWITCH_STAKE,
  LockStage.CANCEL_STAKE,
  LockStage.CANCEL_APPLICATION,
  LockStage.MINT_NOTE,
  LockStage.MINT_IOU,
  LockStage.CONFIRM_MINT_IOU,
  LockStage.CONFIRM_MINT_NOTE,
  LockStage.CONFIRM_CANCEL_APPLICATION,
  LockStage.CONFIRM_CANCEL_STAKE,
  LockStage.CONFIRM_SWITCH_STAKE,
  LockStage.UPDATE_STAKE,
  LockStage.UPDATE_STAKE2,
  LockStage.CONFIRM_UPDATE,
  LockStage.UPDATE_BEFORE_LITIGATIONS,
  LockStage.CONFIRM_UPDATE_BEFORE_LITIGATIONS,
  LockStage.UPDATE_TAX_CONTRACT,
  LockStage.CONFIRM_UPDATE_TAX_CONTRACT,
  LockStage.CLAIM_NOTE,
  LockStage.CONFIRM_CLAIM_NOTE,
  LockStage.CONFIRM_DEPOSIT,
  LockStage.WITHDRAW,
  LockStage.CONFIRM_APPLY,
  LockStage.UPDATE_OWNER,
  LockStage.UPDATE_OWNER,
  LockStage.CONFIRM_UPDATE_STAKE,
  LockStage.CONFIRM_UPDATE_STAKE2,
  LockStage.CONFIRM_WITHDRAW,
  LockStage.CONFIRM_UPDATE_OWNER,
  LockStage.CONFIRM_UPDATE_OWNER,
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
