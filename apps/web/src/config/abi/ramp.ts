export const rampABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_devaddr',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_helper',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '__contractAddress',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: '_ve',
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
    name: 'addBalanceETH',
    outputs: [],
    stateMutability: 'payable',
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
        name: '_bountyId',
        type: 'uint256',
      },
    ],
    name: 'addPartner',
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
        name: '_amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_identityTokenId',
        type: 'uint256',
      },
    ],
    name: 'burn',
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
        name: '_tokenId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_bountyId',
        type: 'uint256',
      },
    ],
    name: 'buyAccount',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'sessionId',
        type: 'string',
      },
    ],
    name: 'buyNative',
    outputs: [],
    stateMutability: 'nonpayable',
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
        internalType: 'uint256[]',
        name: '_bountyIds',
        type: 'uint256[]',
      },
    ],
    name: 'buyRamp',
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
        internalType: 'uint256',
        name: '_identityTokenId',
        type: 'uint256',
      },
    ],
    name: 'checkIdentityProof',
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
        name: '_partnerBountyId',
        type: 'uint256',
      },
    ],
    name: 'claimPendingRevenue',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'collectionId',
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
    inputs: [
      {
        internalType: 'address',
        name: '_token',
        type: 'address',
      },
    ],
    name: 'createProtocol',
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
    ],
    name: 'deleteProtocol',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'deposit',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'devaddr_',
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
        name: '_token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_start',
        type: 'uint256',
      },
    ],
    name: 'getAllPartnerBounties',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '_partners',
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
        name: '_start',
        type: 'uint256',
      },
    ],
    name: 'getAllTokens',
    outputs: [
      {
        internalType: 'address[]',
        name: 'tokens',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getParams',
    outputs: [
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
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
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
        name: '',
        type: 'address',
      },
    ],
    name: 'isAdmin',
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
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_identityTokenId',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: '_sessionId',
        type: 'string',
      },
    ],
    name: 'mint',
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
    name: 'paidRevenue',
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
    name: 'protocolInfo',
    outputs: [
      {
        internalType: 'enum RampStatus',
        name: 'status',
        type: 'uint8',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'bountyId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'profileId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'badgeId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'minted',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'burnt',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'salePrice',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'maxParters',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'cap',
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
    name: 'totalRevenue',
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
        internalType: 'uint256',
        name: '_bountyId',
        type: 'uint256',
      },
    ],
    name: 'unlockBounty',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_admin',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: '_add',
        type: 'bool',
      },
    ],
    name: 'updateAdmin',
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
        name: '_badgeId',
        type: 'uint256',
      },
    ],
    name: 'updateBadgeId',
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
        name: '_bountyId',
        type: 'uint256',
      },
    ],
    name: 'updateBounty',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_devaddr',
        type: 'address',
      },
    ],
    name: 'updateDev',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'updateDevFromCollectionId',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '__ve',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_tokenId',
        type: 'uint256',
      },
    ],
    name: 'updateDevTokenId',
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
        internalType: 'bool',
        name: '_close',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: '_cap',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_salePrice',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_maxParters',
        type: 'uint256',
      },
    ],
    name: 'updateIndividualProtocol',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_mintFee',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_burnFee',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_badgeId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_salePrice',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: '_automatic',
        type: 'bool',
      },
    ],
    name: 'updateParameters',
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
        name: '_profileId',
        type: 'uint256',
      },
    ],
    name: 'updateProfile',
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
        internalType: 'bool',
        name: '_close',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: '_cap',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_salePrice',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_maxParters',
        type: 'uint256',
      },
    ],
    name: 'updateProtocol',
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
        name: '_tokenId',
        type: 'uint256',
      },
    ],
    name: 'updateTokenIdFromProfile',
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
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
