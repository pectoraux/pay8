export const bettingHelperABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'betting',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'bettingId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'period',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'auditor',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'finalNumber',
        type: 'uint256',
      },
    ],
    name: 'BettingResultsIn',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'betting',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'bettingId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'period',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'auditor',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'finalNumber',
        type: 'string',
      },
    ],
    name: 'BettingResultsIn2',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'betting',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'bettingId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'period',
        type: 'uint256',
      },
    ],
    name: 'CloseBetting',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'betting',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: '_user',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'profileId',
        type: 'uint256',
      },
    ],
    name: 'CreateBetting',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'betting',
        type: 'address',
      },
    ],
    name: 'DeleteBetting',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'protocolId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'betting',
        type: 'address',
      },
    ],
    name: 'DeleteProtocol',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'betting',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'bettingId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'period',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'InjectFunds',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'betting',
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
        name: 'rewardForTicketId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'bettingId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'ticketNumber',
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
        indexed: false,
        internalType: 'address',
        name: 'betting',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'bettingId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'period',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
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
        name: 'ticketNumber',
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
        name: 'bettingId',
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
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'betting',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'currentBettingId',
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
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'action',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'adminShare',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'referrerShare',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'bracketDuration',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'pricePerTicket',
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
        internalType: 'uint256[]',
        name: 'rewardsBreakdown',
        type: 'uint256[]',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'media',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'description',
        type: 'string',
      },
    ],
    name: 'UpdateProtocol',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'betting',
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
    ],
    name: 'Withdraw',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'addressToProfileId',
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
    name: 'borrowedTime',
    outputs: [
      {
        internalType: 'uint256',
        name: 'times',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'lastCalled',
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
        name: '_betting',
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
        name: 'bettingId',
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
        internalType: 'address',
        name: '_betting',
        type: 'address',
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
        name: '_period',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: '_bettingId',
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
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'callIntervals',
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
        name: 'user',
        type: 'address',
      },
    ],
    name: 'checkMembership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'betting',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_nfticketId',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: '_productId',
        type: 'string',
      },
    ],
    name: 'confirmSubscription',
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
    inputs: [
      {
        internalType: 'address',
        name: '_betting',
        type: 'address',
      },
    ],
    name: 'deleteBetting',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_bettingProfileId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_currentMediaIdx',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_sponsor',
        type: 'address',
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
    name: 'emitAddSponsor',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_bettingId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_period',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_auditor',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_finalNumber',
        type: 'uint256',
      },
    ],
    name: 'emitBettingResultsIn',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_bettingId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_period',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_auditor',
        type: 'address',
      },
      {
        internalType: 'string',
        name: '_finalNumber',
        type: 'string',
      },
    ],
    name: 'emitBettingResultsIn2',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_bettingId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_period',
        type: 'uint256',
      },
    ],
    name: 'emitCloseBetting',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'protocolId',
        type: 'uint256',
      },
    ],
    name: 'emitDeleteProtocol',
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
        name: '_bettingId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_period',
        type: 'uint256',
      },
    ],
    name: 'emitInjectFunds',
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
        name: '_rewardForTicketId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_bettingId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_ticketId',
        type: 'uint256',
      },
    ],
    name: 'emitTicketsClaim',
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
        name: '_bettingId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_ticketId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_ticketNumber',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_period',
        type: 'uint256',
      },
    ],
    name: 'emitTicketsPurchase',
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
        name: '_bettingId',
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
        name: '_currentBettingId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_startTime',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_token',
        type: 'address',
      },
      {
        internalType: 'string',
        name: '_action',
        type: 'string',
      },
      {
        internalType: 'uint256[5]',
        name: '_values',
        type: 'uint256[5]',
      },
      {
        internalType: 'uint256[]',
        name: '_rewardsBreakdown',
        type: 'uint256[]',
      },
      {
        internalType: 'string',
        name: '_subjects',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_media',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_description',
        type: 'string',
      },
    ],
    name: 'emitUpdateProtocol',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'emitWithdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_start',
        type: 'uint256',
      },
    ],
    name: 'getAllBettings',
    outputs: [
      {
        internalType: 'address[]',
        name: 'bettings',
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
        name: '_bettingProfileId',
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
        internalType: 'address',
        name: '_betting',
        type: 'address',
      },
    ],
    name: 'isGauge',
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
    name: 'maxAdminShare',
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
    ],
    name: 'maxChargeContracts',
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
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'noChargeContracts',
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
    inputs: [
      {
        internalType: 'address',
        name: '_token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_fees',
        type: 'uint256',
      },
    ],
    name: 'notifyFees',
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
    ],
    name: 'partnerPaywall',
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
        name: '_betting',
        type: 'address',
      },
    ],
    name: 'setContractAddressAt',
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
    ],
    name: 'times',
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
    name: 'tradingFee',
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
    ],
    name: 'treasuryFees',
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
        name: '_betting',
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
        name: '_bettingId',
        type: 'uint256',
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
        internalType: 'address',
        name: '_last_gauge',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_user',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_profileId',
        type: 'uint256',
      },
    ],
    name: 'updateGauge',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_newMax',
        type: 'uint256',
      },
    ],
    name: 'updateMaxAdminShare',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_contract',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: '_add',
        type: 'bool',
      },
    ],
    name: 'updateMaxChargeContracts',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_betting',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_partnerPaywall',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_times',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_callIntervals',
        type: 'uint256',
      },
    ],
    name: 'updateMembershipParams',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_contract',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: '_add',
        type: 'bool',
      },
    ],
    name: 'updateNoChargeContracts',
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
        name: '__tradingFee',
        type: 'uint256',
      },
    ],
    name: 'updateTradingFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_betting',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_uriGenerator',
        type: 'address',
      },
    ],
    name: 'updateUriGenerator',
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
    ],
    name: 'uriGenerator',
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
    inputs: [
      {
        internalType: 'uint256',
        name: '_tokenId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_collectionId',
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
        internalType: 'address',
        name: '_token',
        type: 'address',
      },
    ],
    name: 'withdrawFees',
    outputs: [
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
