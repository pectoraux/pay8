import styled from 'styled-components'
import { Modal, Grid, Box, Input } from '@pancakeswap/uikit'
import { LockStage } from './types'

export const StyledModal = styled(Modal)<{ stage: LockStage }>`
  & > div:last-child {
    padding: 0;
  }
`

export const stagesWithApproveButton = [LockStage.CONFIRM_ADD_BALANCE2, LockStage.CONFIRM_EXECUTE_PURCHASE]

export const stagesWithConfirmButton = [
  LockStage.CONFIRM_ADD_BALANCE,
  LockStage.CONFIRM_REMOVE_BALANCE,
  LockStage.CONFIRM_UPDATE_OWNER,
  LockStage.CONFIRM_UPDATE_TOKEN_ID,
  LockStage.CONFIRM_TRANSFER_BALANCE,
  LockStage.CONFIRM_UPDATE_PASSWORD,
  LockStage.CONFIRM_UPDATE_PASSWORD2,
  LockStage.CONFIRM_UPDATE_PROFILE,
]

export const stagesWithBackButton = [
  LockStage.UPDATE_PROFILE,
  LockStage.CONFIRM_UPDATE_PROFILE,
  LockStage.ADD_BALANCE,
  LockStage.ADD_BALANCE2,
  LockStage.UPDATE_PASSWORD,
  LockStage.UPDATE_PASSWORD2,
  LockStage.UPDATE_OWNER,
  LockStage.REMOVE_BALANCE,
  LockStage.UPDATE_TOKEN_ID,
  LockStage.EXECUTE_PURCHASE,
  LockStage.TRANSFER_BALANCE,
  LockStage.CONFIRM_UPDATE_PASSWORD,
  LockStage.CONFIRM_UPDATE_PASSWORD2,
  LockStage.CONFIRM_ADD_BALANCE,
  LockStage.CONFIRM_ADD_BALANCE2,
  LockStage.CONFIRM_UPDATE_OWNER,
  LockStage.CONFIRM_REMOVE_BALANCE,
  LockStage.CONFIRM_UPDATE_TOKEN_ID,
  LockStage.CONFIRM_TRANSFER_BALANCE,
  LockStage.CONFIRM_EXECUTE_PURCHASE,
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
