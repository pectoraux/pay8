export const nfticketHelperABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'merchant',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'likes',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'dislikes',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'like',
        type: 'bool',
      },
    ],
    name: 'Voted',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_item',
        type: 'string',
      },
      {
        internalType: 'address',
        name: '_marketPlaceHelper',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_itemTimeEstimate',
        type: 'uint256',
      },
      {
        internalType: 'uint256[]',
        name: '_options',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: '_estimates',
        type: 'uint256[]',
      },
    ],
    name: 'addTimeEstimates',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'adminFee',
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
    name: 'adminFeeOnMarketWideAds',
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
        internalType: 'string',
        name: '_tokenId',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: '_collectionId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_ticketId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_sender',
        type: 'address',
      },
      {
        internalType: 'uint256[5]',
        name: '_voteParams',
        type: 'uint256[5]',
      },
    ],
    name: 'cancanVote',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'claimLotteryRevenue',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'claimPendingRevenue',
    outputs: [],
    stateMutability: 'nonpayable',
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
    name: 'currentMediaIdx',
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
    ],
    name: 'estimateVotes',
    outputs: [
      {
        internalType: 'uint256',
        name: 'likes',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'dislikes',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'firstCollectionId',
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
        name: '_merchantId',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: '_tag',
        type: 'string',
      },
    ],
    name: 'getExcludedContents',
    outputs: [
      {
        internalType: 'string[]',
        name: '_excluded',
        type: 'string[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_merchantId',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: '_tokenId',
        type: 'string',
      },
    ],
    name: 'getSponsorsMedia',
    outputs: [
      {
        internalType: 'string[]',
        name: '_media',
        type: 'string[]',
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
      {
        internalType: 'string',
        name: '_item',
        type: 'string',
      },
      {
        internalType: 'address',
        name: '_marketPlaceHelper',
        type: 'address',
      },
      {
        internalType: 'uint256[]',
        name: '_options',
        type: 'uint256[]',
      },
    ],
    name: 'getTimeEstimates',
    outputs: [
      {
        internalType: 'uint256',
        name: '_timeEstimate',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'lottery',
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
    ],
    name: 'lotteryCredits',
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
    name: 'lotteryFee',
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
    name: 'maxNumMedia',
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
    ],
    name: 'pendingRevenue',
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
    ],
    name: 'pricePerAttachMinutes',
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
    ],
    name: 'scheduledMedia',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'expires',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'message',
        type: 'string',
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
        name: '_sponsor',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_merchantId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_referrerId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: '_tag',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_message',
        type: 'string',
      },
    ],
    name: 'sponsorTag',
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
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    name: 'tagRegistrations',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'treasury',
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
        name: '_pricePerAttachMinutes',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_adminFee',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_adminFeeOnMarketWideAds',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_lotteryFee',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_maxNumMedia',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_firstCollectionId',
        type: 'uint256',
      },
    ],
    name: 'updateAdminNLotteryFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_tag',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_contentName',
        type: 'string',
      },
      {
        internalType: 'bool',
        name: '_add',
        type: 'bool',
      },
    ],
    name: 'updateExcludedContent',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_pricePerAttachMinutes',
        type: 'uint256',
      },
    ],
    name: 'updatePricePerAttachMinutes',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_merchantId',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: '_tag',
        type: 'string',
      },
    ],
    name: 'updateSponsorMedia',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_tokenId',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_tag',
        type: 'string',
      },
    ],
    name: 'updateTag',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_tag',
        type: 'string',
      },
      {
        internalType: 'bool',
        name: '_add',
        type: 'bool',
      },
    ],
    name: 'updateTagRegistration',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'ticketId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'merchantId',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'item',
        type: 'string',
      },
    ],
    name: 'verifyNFT',
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
        name: '_merchant',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_profileId',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'like',
        type: 'bool',
      },
    ],
    name: 'vote',
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
    name: 'voted',
    outputs: [
      {
        internalType: 'int256',
        name: '',
        type: 'int256',
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
        name: '_amount',
        type: 'uint256',
      },
    ],
    name: 'withdrawTreasury',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
