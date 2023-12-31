import styled from 'styled-components'
import { Modal, Grid, Box, Input } from '@pancakeswap/uikit'
import { LockStage } from './types'

export const StyledModal = styled(Modal)<{ stage: LockStage }>`
  & > div:last-child {
    padding: 0;
  }
`

export const stagesWithApproveButton = [
  LockStage.CONFIRM_DEPOSIT,
  LockStage.CONFIRM_UPDATE_AUTOCHARGE,
  LockStage.CONFIRM_SPONSOR_TAG,
]

export const stagesWithConfirmButton = [
  LockStage.CONFIRM_DELETE,
  LockStage.CONFIRM_WITHDRAW,
  LockStage.CONFIRM_DELETE_PROTOCOL,
  LockStage.CONFIRM_UPDATE_PROTOCOL,
  LockStage.CONFIRM_UPDATE_PARAMETERS,
  LockStage.CONFIRM_ADMIN_AUTOCHARGE,
  LockStage.CONFIRM_UPDATE_BOUNTY,
  LockStage.CONFIRM_VOTE,
  LockStage.CONFIRM_UPDATE_ADMIN,
  LockStage.CONFIRM_UPDATE_DEV,
  LockStage.CONFIRM_UPDATE_DISCOUNT_DIVISOR,
  LockStage.CONFIRM_UPDATE_PENALTY_DIVISOR,
  LockStage.CONFIRM_UPDATE_TAX_CONTRACT,
  LockStage.CONFIRM_UPDATE_TOKEN_IDS,
  LockStage.CONFIRM_UPDATE_PROFILE_ID,
  LockStage.CONFIRM_TRANSFER_RECEIVABLE_TO_NOTE,
  LockStage.CONFIRM_CLAIM_NOTE,
  LockStage.CONFIRM_UPDATE_TAG_REGISTRATION,
  LockStage.CONFIRM_UPDATE_CODE_INFO,
  LockStage.CONFIRM_UPDATE_SPONSOR_MEDIA,
  LockStage.CONFIRM_CLAIM_TOKEN_SPONSOR_FUND,
  LockStage.CONFIRM_CLAIM_PENDING,
  LockStage.CONFIRM_UPDATE_CATEGORY,
  LockStage.CONFIRM_UPDATE_PRICE_PER_MINUTES,
  LockStage.CONFIRM_UPDATE_EXCLUDED_CONTENT,
  LockStage.CONFIRM_UPDATE_WORLD_BOUNTY,
  LockStage.CONFIRM_MINT_PAST_WORLD,
  LockStage.CONFIRM_MINT_PRESENT_WORLD,
  LockStage.CONFIRM_UPDATE_URI_GENERATOR,
  LockStage.CONFIRM_UPDATE_LOCATION,
]

export const stagesWithBackButton = [
  LockStage.DEPOSIT,
  LockStage.CONFIRM_DEPOSIT,
  LockStage.UPDATE_PROFILE_ID,
  LockStage.UPDATE_LOCATION,
  LockStage.CONFIRM_UPDATE_LOCATION,
  LockStage.UPDATE_CATEGORY,
  LockStage.CONFIRM_WITHDRAW,
  LockStage.CONFIRM_UPDATE_CATEGORY,
  LockStage.UPDATE_PRICE_PER_MINUTES,
  LockStage.CONFIRM_UPDATE_PRICE_PER_MINUTES,
  LockStage.UPDATE_EXCLUDED_CONTENT,
  LockStage.CONFIRM_UPDATE_EXCLUDED_CONTENT,
  LockStage.UPDATE_WORLD_BOUNTY,
  LockStage.CONFIRM_UPDATE_WORLD_BOUNTY,
  LockStage.MINT_PAST_WORLD,
  LockStage.CONFIRM_MINT_PAST_WORLD,
  LockStage.MINT_PRESENT_WORLD,
  LockStage.CONFIRM_MINT_PRESENT_WORLD,
  LockStage.UPDATE_URI_GENERATOR,
  LockStage.CONFIRM_UPDATE_URI_GENERATOR,
  LockStage.CONFIRM_CLAIM_PENDING,
  LockStage.CLAIM_TOKEN_SPONSOR_FUND,
  LockStage.CONFIRM_CLAIM_TOKEN_SPONSOR_FUND,
  LockStage.UPDATE_SPONSOR_MEDIA,
  LockStage.CONFIRM_UPDATE_SPONSOR_MEDIA,
  LockStage.UPDATE_CODE_INFO,
  LockStage.CONFIRM_UPDATE_CODE_INFO,
  LockStage.UPDATE_TAG_REGISTRATION,
  LockStage.SPONSOR_TAG,
  LockStage.CONFIRM_SPONSOR_TAG,
  LockStage.CONFIRM_UPDATE_TAG_REGISTRATION,
  LockStage.CLAIM_NOTE,
  LockStage.CONFIRM_CLAIM_NOTE,
  LockStage.TRANSFER_RECEIVABLE_TO_NOTE,
  LockStage.CONFIRM_TRANSFER_RECEIVABLE_TO_NOTE,
  LockStage.CONFIRM_UPDATE_PROFILE_ID,
  LockStage.UPDATE_TOKEN_IDS,
  LockStage.CONFIRM_UPDATE_TOKEN_IDS,
  LockStage.UPDATE_TAX_CONTRACT,
  LockStage.CONFIRM_UPDATE_TAX_CONTRACT,
  LockStage.UPDATE_DISCOUNT_DIVISOR,
  LockStage.CONFIRM_UPDATE_DISCOUNT_DIVISOR,
  LockStage.UPDATE_PENALTY_DIVISOR,
  LockStage.CONFIRM_UPDATE_PENALTY_DIVISOR,
  LockStage.UPDATE_ADMIN,
  LockStage.UPDATE_DEV,
  LockStage.CONFIRM_UPDATE_ADMIN,
  LockStage.CONFIRM_UPDATE_DEV,
  LockStage.DELETE,
  LockStage.DELETE_PROTOCOL,
  LockStage.UPDATE_PROTOCOL,
  LockStage.UPDATE_PARAMETERS,
  LockStage.ADMIN_AUTOCHARGE,
  LockStage.UPDATE_AUTOCHARGE,
  LockStage.UPDATE_BOUNTY,
  LockStage.VOTE,
  LockStage.CONFIRM_DELETE,
  LockStage.CONFIRM_DELETE_PROTOCOL,
  LockStage.CONFIRM_UPDATE_PROTOCOL,
  LockStage.CONFIRM_UPDATE_PARAMETERS,
  LockStage.CONFIRM_ADMIN_AUTOCHARGE,
  LockStage.CONFIRM_UPDATE_AUTOCHARGE,
  LockStage.CONFIRM_UPDATE_BOUNTY,
  LockStage.CONFIRM_VOTE,
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
