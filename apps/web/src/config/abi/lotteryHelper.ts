export const lotteryHelperABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_collection',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_position',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_number',
        type: 'uint256',
      },
    ],
    name: 'burnForCredit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'burnTokenForCredit',
    outputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'checker',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'destination',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'discount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'collectionId',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'item',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_collectionId',
        type: 'uint256',
      },
    ],
    name: 'burnTokenForCreditLength',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_lotteryId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_ticketId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_bracket',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_token',
        type: 'address',
      },
    ],
    name: 'calculateRewardsForTicketId',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_collection',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_user',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_nfticketId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_identityTokenId',
        type: 'uint256',
      },
      {
        internalType: 'uint256[]',
        name: '_ticketNumbers',
        type: 'uint256[]',
      },
    ],
    name: 'checkIdentity',
    outputs: [
      {
        internalType: 'uint256',
        name: '_lotteryId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_merchantId',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'collectionIdToLotteryId',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'contractAddress',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'currentLotteryId',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_user',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_lotteryId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
    ],
    name: 'decreasePaymentCredits',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_user',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_lotteryId',
        type: 'uint256',
      },
    ],
    name: 'deletePaymentCredits',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'minDiscountDivisor',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'nftPrizes',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    name: 'onERC1155Received',
    outputs: [
      {
        internalType: 'bytes4',
        name: '',
        type: 'bytes4',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    name: 'onERC721Received',
    outputs: [
      {
        internalType: 'bytes4',
        name: '',
        type: 'bytes4',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'paymentCredits',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_contractAddress',
        type: 'address',
      },
    ],
    name: 'setContractAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_valuepool',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_startTime',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_endTime',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_endAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_lockDuration',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: '_useNFTicket',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: '_isNFT',
        type: 'uint256',
      },
      {
        internalType: 'uint256[4]',
        name: '_values',
        type: 'uint256[4]',
      },
      {
        internalType: 'uint256[6]',
        name: '_rewardsBreakdown',
        type: 'uint256[6]',
      },
    ],
    name: 'startLottery',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'treasuryFee',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_token',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_checker',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_destination',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_discount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '__collectionId',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: '_clear',
        type: 'bool',
      },
      {
        internalType: 'string',
        name: '_item',
        type: 'string',
      },
    ],
    name: 'updateBurnTokenForCredit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_token',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_from',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_lotteryId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_tokenId',
        type: 'uint256',
      },
    ],
    name: 'updateNFTPrizes',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_treasuryFee',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_minDiscountDivisor',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_minLengthLottery',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_maxNumberTicketsPerBuyOrClaim',
        type: 'uint256',
      },
    ],
    name: 'updateParams',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256[]',
        name: '_ticketIds',
        type: 'uint256[]',
      },
    ],
    name: 'viewNumbersAndStatusesForTicketIds',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
      {
        internalType: 'bool[]',
        name: '',
        type: 'bool[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_lotteryId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_ticketId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_bracket',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_token',
        type: 'address',
      },
    ],
    name: 'viewRewardsForTicketId',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_user',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_lotteryId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_cursor',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'length',
        type: 'uint256',
      },
    ],
    name: 'viewUserInfoForLotteryId',
    outputs: [
      {
        internalType: 'uint256[]',
        name: 'lotteryTicketIds',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: 'ticketNumbers',
        type: 'uint256[]',
      },
      {
        internalType: 'bool[]',
        name: 'ticketStatuses',
        type: 'bool[]',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_lotteryId',
        type: 'uint256',
      },
    ],
    name: 'withdrawNFTPrize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_lotteryId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_identityTokenId',
        type: 'uint256',
      },
    ],
    name: 'withdrawPendingRewardFromLottery',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
