export const valuePoolHelper2ABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_vava',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: '_add',
        type: 'bool',
      },
    ],
    name: 'autoUpdateGeoTag',
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
    name: 'autoUpdateTag',
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
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'blackListedMerchant',
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
        internalType: 'bool',
        name: '_onlyTrustWorthyAuditors',
        type: 'bool',
      },
      {
        internalType: 'address',
        name: '_gauge',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_gauge2',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_owner',
        type: 'address',
      },
    ],
    name: 'checkContains',
    outputs: [],
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
        name: '_vava',
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
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'geoTag',
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
        name: '_valuepool',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_start',
        type: 'uint256',
      },
    ],
    name: 'getAllMerchantTrustWorthyAuditors',
    outputs: [
      {
        internalType: 'address[]',
        name: '_auditors',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_valuepool',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_start',
        type: 'uint256',
      },
    ],
    name: 'getAllVavaTrustWorthyMerchants',
    outputs: [
      {
        internalType: 'address[]',
        name: '_merchants',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_vava',
        type: 'address',
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
        name: '_vava',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_tokenId',
        type: 'uint256',
      },
    ],
    name: 'getMedia',
    outputs: [
      {
        internalType: 'string[]',
        name: 'mediaData',
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
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'media',
    outputs: [
      {
        internalType: 'string',
        name: '',
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
        name: '_valuepool',
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
        name: '_valuepool',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_merchant',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: '_blacklist',
        type: 'bool',
      },
    ],
    name: 'updateBlacklistMerchant',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_vava',
        type: 'address',
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
        name: '_vava',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_geoTag',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_tokenId',
        type: 'uint256',
      },
    ],
    name: 'updateGeoTag',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_maxNumMedia',
        type: 'uint256',
      },
    ],
    name: 'updateMaxNumMedia',
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
        internalType: 'address',
        name: '_vava',
        type: 'address',
      },
      {
        internalType: 'string',
        name: '_media',
        type: 'string',
      },
    ],
    name: 'updateMedia',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_valuepool',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_auditor',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: '_add',
        type: 'bool',
      },
    ],
    name: 'updateMerchantTrustWorthyAuditors',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_valuepool',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_merchant',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: '_add',
        type: 'bool',
      },
    ],
    name: 'updateVavaTrustWorthyMerchants',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
