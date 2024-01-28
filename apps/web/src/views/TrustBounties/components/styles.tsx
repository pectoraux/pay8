import styled from 'styled-components'
import { Modal, Grid, Box, Input } from '@pancakeswap/uikit'
import { LockStage } from './types'

export const StyledModal = styled(Modal)<{ stage: LockStage }>`
  & > div:last-child {
    padding: 0;
  }
`

export const stagesWithApproveButton = [LockStage.CONFIRM_ADD_APPROVAL, LockStage.CONFIRM_ADD_BALANCE]

export const stagesWithConfirmButton = [
  LockStage.CONFIRM_UPDATE,
  LockStage.CONFIRM_UPDATE_OWNER,
  LockStage.CONFIRM_APPLY_RESULTS,
  LockStage.CONFIRM_ADD_RECURRING_BALANCE,
  LockStage.CONFIRM_CLEAN_UP_APPROVALS,
  LockStage.CONFIRM_CLEAN_UP_BALANCES,
  LockStage.CONFIRM_DELETE_APPROVAL,
  LockStage.CONFIRM_DELETE_BOUNTY,
  LockStage.CONFIRM_UPDATE_LOCATION,
  LockStage.CONFIRM_GET_FROM_VALUEPOOL,
  LockStage.CONFIRM_GET_FROM_APPROVAL,
  LockStage.CONFIRM_INCREASE_END_TIME,
]

export const stagesWithBackButton = [
  LockStage.DELETE_BOUNTY,
  LockStage.INCREASE_END_TIME,
  LockStage.CONFIRM_INCREASE_END_TIME,
  LockStage.UPDATE_LOCATION,
  LockStage.CONFIRM_UPDATE_LOCATION,
  LockStage.UPDATE,
  LockStage.ADD_BALANCE,
  LockStage.UPDATE_OWNER,
  LockStage.APPLY_RESULTS,
  LockStage.ADD_RECURRING_BALANCE,
  LockStage.CLEAN_UP_APPROVALS,
  LockStage.CLEAN_UP_BALANCES,
  LockStage.ADD_APPROVAL,
  LockStage.DELETE_APPROVAL,
  LockStage.GET_FROM_VALUEPOOL,
  LockStage.GET_FROM_APPROVAL,
  LockStage.CONFIRM_GET_FROM_VALUEPOOL,
  LockStage.CONFIRM_GET_FROM_APPROVAL,
  LockStage.CONFIRM_UPDATE,
  LockStage.CONFIRM_ADD_BALANCE,
  LockStage.CONFIRM_UPDATE_OWNER,
  LockStage.CONFIRM_APPLY_RESULTS,
  LockStage.CONFIRM_ADD_RECURRING_BALANCE,
  LockStage.CONFIRM_CLEAN_UP_APPROVALS,
  LockStage.CONFIRM_CLEAN_UP_BALANCES,
  LockStage.CONFIRM_ADD_APPROVAL,
  LockStage.CONFIRM_DELETE_APPROVAL,
  LockStage.CONFIRM_DELETE_BOUNTY,
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
