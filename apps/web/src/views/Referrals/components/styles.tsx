import styled from 'styled-components'
import { Modal, Grid, Box, Input } from '@pancakeswap/uikit'
import { LockStage } from './types'

export const StyledModal = styled(Modal)<{ stage: LockStage }>`
  & > div:last-child {
    padding: 0;
  }
`

export const stagesWithApproveButton = [LockStage.CONFIRM_UPDATE_BRIBES, LockStage.CONFIRM_ERASE_DEBT2]

export const stagesWithConfirmButton = [
  LockStage.CONFIRM_DELETE,
  LockStage.CONFIRM_DISTRIBUTE,
  LockStage.CONFIRM_WITHDRAW,
  LockStage.CONFIRM_ADMIN_WITHDRAW,
  LockStage.CONFIRM_UPDATE_BOUNTY,
  LockStage.CONFIRM_UPDATE_GAUGE,
  LockStage.CONFIRM_LOCK_TOKENS,
  LockStage.CONFIRM_ERASE_DEBT,
]

export const stagesWithBackButton = [
  LockStage.ERASE_DEBT,
  LockStage.ERASE_DEBT2,
  LockStage.CONFIRM_ERASE_DEBT,
  LockStage.CONFIRM_ERASE_DEBT2,
  LockStage.UPDATE_BRIBES,
  LockStage.UPDATE_BOUNTY,
  LockStage.WITHDRAW,
  LockStage.DELETE,
  LockStage.DELETE,
  LockStage.CONFIRM_LOCK_TOKENS,
  LockStage.CONFIRM_UPDATE_GAUGE,
  LockStage.CONFIRM_DISTRIBUTE,
  LockStage.CONFIRM_DELETE,
  LockStage.CONFIRM_UPDATE_BOUNTY,
  LockStage.CONFIRM_WITHDRAW,
  LockStage.CONFIRM_ADMIN_WITHDRAW,
  LockStage.CONFIRM_UPDATE_BRIBES,
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
