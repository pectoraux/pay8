export const marketHelper2ABI = [
  {
    inputs: [
      {
        internalType: 'string',
        name: '_tokenId',
        type: 'string',
      },
    ],
    name: 'addCashBackToRevenue',
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
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    name: 'cashbackRevenue',
    outputs: [
      {
        internalType: 'uint256',
        name: 'bufferTime',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount',
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
        name: '_referrer',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_referrerFee',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_collectionId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_bountyId',
        type: 'uint256',
      },
      {
        internalType: 'bytes32',
        name: '_tokenId',
        type: 'bytes32',
      },
      {
        internalType: 'bool',
        name: '_senderIsSeller',
        type: 'bool',
      },
    ],
    name: 'checkBounty',
    outputs: [],
    stateMutability: 'nonpayable',
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
        internalType: 'uint256',
        name: '_identityTokenId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_owner',
        type: 'address',
      },
      {
        internalType: 'string',
        name: '_tokenId',
        type: 'string',
      },
    ],
    name: 'checkOrderIdentityProof',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'nonpayable',
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
        internalType: 'uint256',
        name: '_identityTokenId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_owner',
        type: 'address',
      },
    ],
    name: 'checkPartnerIdentityProof',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_ve',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_user',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_tFIAT',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_maxSupply',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_dropinTimer',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_rsrcTokenId',
        type: 'uint256',
      },
    ],
    name: 'checkRequirements',
    outputs: [],
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
        internalType: 'uint256',
        name: '_identityTokenId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_owner',
        type: 'address',
      },
    ],
    name: 'checkUserIdentityProof',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_seller',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_referrer',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_bountyId',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: '_tokenId',
        type: 'string',
      },
      {
        internalType: 'bool',
        name: 'deactivate',
        type: 'bool',
      },
    ],
    name: 'closeReferral',
    outputs: [],
    stateMutability: 'nonpayable',
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
        name: '_tokenId',
        type: 'string',
      },
    ],
    name: 'getColor',
    outputs: [
      {
        internalType: 'enum COLOR',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_referrerCollectionId',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: '_tokenId',
        type: 'string',
      },
    ],
    name: 'getReferral',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'collectionId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'referrerFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'bountyId',
            type: 'uint256',
          },
        ],
        internalType: 'struct Referral',
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
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'partnerShip',
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
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    name: 'percentiles',
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
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'tokenIdToAuditor',
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
        internalType: 'uint256[]',
        name: 'userProfileIds',
        type: 'uint256[]',
      },
      {
        internalType: 'bool',
        name: 'blacklist',
        type: 'bool',
      },
    ],
    name: 'updateBlacklistedIdentities',
    outputs: [],
    stateMutability: 'nonpayable',
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
        internalType: 'string',
        name: '_tokenId',
        type: 'string',
      },
    ],
    name: 'updateCashbackRevenue',
    outputs: [],
    stateMutability: 'nonpayable',
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
        internalType: 'string',
        name: '_tokenId',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'profileId',
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
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    name: 'votes',
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
] as const
