import styled from 'styled-components'
import { Modal, Grid, Box, Input } from '@pancakeswap/uikit'
import { LockStage } from './types'

export const StyledModal = styled(Modal)<{ stage: LockStage }>`
  & > div:last-child {
    padding: 0;
  }
`

export const stagesWithApproveButton = [LockStage.CONFIRM_DEPOSIT, LockStage.CONFIRM_MERGE]

export const stagesWithConfirmButton = [
  LockStage.CONFIRM_NOTIFY_PAYMENT,
  LockStage.CONFIRM_WITHDRAW,
  LockStage.CONFIRM_REMOVE_SPONSORS,
  LockStage.CONFIRM_CREATE_LOCK,
  LockStage.CONFIRM_REIMBURSE_BNPL,
  LockStage.CONFIRM_REIMBURSE,
  LockStage.CONFIRM_ADD_CREDIT,
  LockStage.CONFIRM_NOTIFY_LOAN,
  LockStage.CONFIRM_PICK_RANK,
  LockStage.CONFIRM_EXECUTE_NEXT_PURCHASE,
  LockStage.CONFIRM_UPDATE_TAX_CONTRACT,
  LockStage.CONFIRM_CHECK_RANK,
]

export const stagesWithBackButton = [
  LockStage.CHECK_RANK,
  LockStage.CONFIRM_CHECK_RANK,
  LockStage.UPDATE_TAX_CONTRACT,
  LockStage.CONFIRM_UPDATE_TAX_CONTRACT,
  LockStage.CONFIRM_EXECUTE_NEXT_PURCHASE,
  LockStage.PICK_RANK,
  LockStage.CONFIRM_PICK_RANK,
  LockStage.NOTIFY_LOAN,
  LockStage.CONFIRM_NOTIFY_LOAN,
  LockStage.ADD_CREDIT,
  LockStage.CONFIRM_ADD_CREDIT,
  LockStage.REIMBURSE,
  LockStage.CONFIRM_REIMBURSE,
  LockStage.REIMBURSE_BNPL,
  LockStage.CONFIRM_REIMBURSE_BNPL,
  LockStage.MERGE,
  LockStage.DEPOSIT,
  LockStage.WITHDRAW,
  LockStage.HISTORY,
  LockStage.NOTIFY_PAYMENT,
  LockStage.CONFIRM_NOTIFY_PAYMENT,
  LockStage.REMOVE_SPONSORS,
  LockStage.CREATE_LOCK,
  LockStage.CONFIRM_CREATE_LOCK,
  LockStage.CONFIRM_ADD_SPONSORS,
  LockStage.CONFIRM_REMOVE_SPONSORS,
  LockStage.CONFIRM_MERGE,
  LockStage.CONFIRM_DEPOSIT,
  LockStage.CONFIRM_WITHDRAW,
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
