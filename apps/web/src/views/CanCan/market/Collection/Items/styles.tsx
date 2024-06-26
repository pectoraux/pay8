import styled from 'styled-components'
import { Modal, Grid, Box, Input } from '@pancakeswap/uikit'
import { LockStage } from './types'

export const StyledModal = styled(Modal)<{ stage: LockStage }>`
  & > div:last-child {
    padding: 0;
  }
`
export const stagesWithApproveButton = [LockStage.CONFIRM_UPDATE_AUTOCHARGE, LockStage.CONFIRM_AUTOCHARGE]

export const stagesWithConfirmButton = [
  LockStage.CONFIRM_UPDATE_FREE_TRIAL,
  LockStage.CONFIRM_DELETE_PROTOCOL,
  LockStage.CONFIRM_WITHDRAW,
  LockStage.CONFIRM_UPDATE_PARAMETERS,
  LockStage.CONFIRM_UPDATE_OWNER,
  LockStage.CONFIRM_UPDATE_OWNER,
  LockStage.CONFIRM_UPDATE_ADMIN,
  LockStage.CONFIRM_UPDATE_DISCOUNT_DIVISOR,
  LockStage.CONFIRM_UPDATE_PENALTY_DIVISOR,
  LockStage.CONFIRM_UPDATE_PROFILE_ID,
  LockStage.CONFIRM_DELETE,
]

export const stagesWithBackButton = [
  LockStage.DELETE,
  LockStage.CONFIRM_DELETE,
  LockStage.PARTNER,
  LockStage.CONFIRM_PARTNER,
  LockStage.UPDATE_FREE_TRIAL,
  LockStage.CONFIRM_UPDATE_FREE_TRIAL,
  LockStage.UPDATE_PROFILE_ID,
  LockStage.CONFIRM_UPDATE_PROFILE_ID,
  LockStage.UPDATE_DISCOUNT_DIVISOR,
  LockStage.CONFIRM_UPDATE_DISCOUNT_DIVISOR,
  LockStage.UPDATE_PENALTY_DIVISOR,
  LockStage.CONFIRM_UPDATE_PENALTY_DIVISOR,
  LockStage.UPDATE_ADMIN,
  LockStage.CONFIRM_UPDATE_ADMIN,
  LockStage.DELETE_PROTOCOL,
  LockStage.AUTOCHARGE,
  LockStage.CONFIRM_AUTOCHARGE,
  LockStage.WITHDRAW,
  LockStage.UPDATE_PARAMETERS,
  LockStage.UPDATE_AUTOCHARGE,
  LockStage.UPDATE_OWNER,
  LockStage.UPDATE_OWNER,
  LockStage.CONFIRM_DELETE_PROTOCOL,
  LockStage.CONFIRM_WITHDRAW,
  LockStage.CONFIRM_UPDATE_PARAMETERS,
  LockStage.CONFIRM_UPDATE_AUTOCHARGE,
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
