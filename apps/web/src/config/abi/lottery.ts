export const lotteryABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_contractAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_randomGeneratorAddress',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'lotteryId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256[6]',
        name: 'countWinnersPerBracket',
        type: 'uint256[6]',
      },
    ],
    name: 'LotteryClose',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'lotteryId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'injectedAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
    ],
    name: 'LotteryInjection',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'lotteryId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'finalNumber',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'countWinningTickets',
        type: 'uint256',
      },
    ],
    name: 'LotteryNumberDrawn',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'lotteryId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'treasuryFee',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'referrerFee',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'priceTicket',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'firstTicketId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'discountDivisor',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'startTime',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'endTime',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'collectionId',
        type: 'uint256',
      },
    ],
    name: 'LotteryOpen',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'lotteryId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'pricePerTicket',
        type: 'uint256',
      },
    ],
    name: 'PricePerTicketUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'claimer',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'lotteryId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'ticketId',
        type: 'uint256',
      },
    ],
    name: 'TicketsClaim',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'buyer',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'lotteryId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'ticketId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'numberTicket',
        type: 'uint256',
      },
    ],
    name: 'TicketsPurchase',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'idx',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'collectionId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'paramName',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'paramValue',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'paramValue2',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'paramValue3',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'paramValue4',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'paramValue5',
        type: 'string',
      },
    ],
    name: 'UpdateMiscellaneous',
    type: 'event',
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
    name: 'amountCollected',
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
        internalType: 'address',
        name: '_referrer',
        type: 'address',
      },
      {
        internalType: 'string',
        name: '_lotteryName',
        type: 'string',
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
    name: 'buyWithContract',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_numberTickets',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_lotteryId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_nfticketId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_user',
        type: 'address',
      },
    ],
    name: 'calculateTotalPriceForBulkTickets',
    outputs: [
      {
        internalType: 'uint256',
        name: '_price',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_lotteryCredits',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_token',
        type: 'address',
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
        internalType: 'address',
        name: '_token',
        type: 'address',
      },
    ],
    name: 'claimLotteryRevenue',
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
    ],
    name: 'claimLotteryRevenueFomSponsors',
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
        internalType: 'uint256',
        name: '_lotteryId',
        type: 'uint256',
      },
      {
        internalType: 'uint256[]',
        name: '_ticketIds',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: '_brackets',
        type: 'uint256[]',
      },
    ],
    name: 'claimTickets',
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
    ],
    name: 'closeLottery',
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
        name: '_user',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_lotteryId',
        type: 'uint256',
      },
    ],
    name: 'deleteReward',
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
    ],
    name: 'drawFinalNumberAndMakeLotteryClaimable',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_idx',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_collectionId',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'paramName',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'paramValue',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'paramValue2',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'paramValue3',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'paramValue4',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'paramValue5',
        type: 'string',
      },
    ],
    name: 'emitUpdateMiscellaneous',
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
        name: '_start',
        type: 'uint256',
      },
    ],
    name: 'getAllTokens',
    outputs: [
      {
        internalType: 'address[]',
        name: '_tokens',
        type: 'address[]',
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
        internalType: 'address',
        name: '_user',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_token',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: '_referrer',
        type: 'bool',
      },
    ],
    name: 'getPendingReward',
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
    ],
    name: 'getUserTicketIdsPerLotteryId',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
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
        name: '_amount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_token',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: '_reinject',
        type: 'bool',
      },
    ],
    name: 'injectFunds',
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
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'priceTicket',
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
        name: '_currentLotteryId',
        type: 'uint256',
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
        internalType: 'uint256',
        name: '_collectionId',
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
    ],
    name: 'toReinject',
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
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'tokenPerBracket',
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
        name: '_newMinTicketNumber',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_newTicketRange',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_newMaxTreasuryFee',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_minReward',
        type: 'uint256',
      },
    ],
    name: 'updateLotteryVariables',
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
        internalType: 'uint256',
        name: '_lotteryId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_pricePerTicket',
        type: 'uint256',
      },
    ],
    name: 'updatePricePerTicket',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_braket',
        type: 'uint256',
      },
    ],
    name: 'viewBracketCalculator',
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
    ],
    name: 'viewLottery',
    outputs: [
      {
        components: [
          {
            internalType: 'enum LotteryStatus',
            name: 'status',
            type: 'uint8',
          },
          {
            internalType: 'uint256',
            name: 'startTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'endTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'endAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'discountDivisor',
            type: 'uint256',
          },
          {
            internalType: 'uint256[6]',
            name: 'rewardsBreakdown',
            type: 'uint256[6]',
          },
          {
            internalType: 'uint256[6]',
            name: 'countWinnersPerBracket',
            type: 'uint256[6]',
          },
          {
            internalType: 'uint256',
            name: 'firstTicketId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'lockDuration',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'finalNumber',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'valuepool',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'fee',
                type: 'uint256',
              },
              {
                internalType: 'enum NFTYPE',
                name: 'isNFT',
                type: 'uint8',
              },
              {
                internalType: 'bool',
                name: 'useNFTicket',
                type: 'bool',
              },
              {
                internalType: 'uint256',
                name: 'referrerFee',
                type: 'uint256',
              },
            ],
            internalType: 'struct Treasury',
            name: 'treasury',
            type: 'tuple',
          },
        ],
        internalType: 'struct Lottery',
        name: '',
        type: 'tuple',
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
        name: '_winningNumberTransformed',
        type: 'uint256',
      },
    ],
    name: 'viewNumberTicketsPerLotteryId',
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
        name: '_ticketId',
        type: 'uint256',
      },
    ],
    name: 'viewTicket',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'number',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
        ],
        internalType: 'struct Ticket',
        name: '',
        type: 'tuple',
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
    name: 'withdrawNFTPendingReward',
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
    name: 'withdrawPendingReward',
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
        internalType: 'address',
        name: '_token',
        type: 'address',
      },
    ],
    name: 'withdrawTreasury',
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
        internalType: 'address',
        name: '_token',
        type: 'address',
      },
    ],
    name: 'withrawReferrerFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
