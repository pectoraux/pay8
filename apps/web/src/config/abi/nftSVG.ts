export const nftSVGABI = [
  {
    inputs: [],
    name: 'MAX_NUM_OF_PARAMS',
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
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'token1',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'token2',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'channelOwner',
        type: 'address',
      },
      {
        internalType: 'string[]',
        name: 'media',
        type: 'string[]',
      },
      {
        internalType: 'string[]',
        name: 'optionNames',
        type: 'string[]',
      },
      {
        internalType: 'string[]',
        name: 'optionValues',
        type: 'string[]',
      },
      {
        internalType: 'string[]',
        name: 'chat',
        type: 'string[]',
      },
    ],
    name: 'constructTokenURI',
    outputs: [
      {
        internalType: 'string',
        name: 'res',
        type: 'string',
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
        name: '',
        type: 'address',
      },
    ],
    name: 'description',
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
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'token1',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'token2',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'channelOwner',
        type: 'address',
      },
      {
        internalType: 'string[]',
        name: 'media',
        type: 'string[]',
      },
      {
        internalType: 'string[]',
        name: 'optionNames',
        type: 'string[]',
      },
      {
        internalType: 'string[]',
        name: 'optionValues',
        type: 'string[]',
      },
      {
        internalType: 'string[]',
        name: 'chat',
        type: 'string[]',
      },
    ],
    name: 'generateSVG',
    outputs: [
      {
        internalType: 'string',
        name: 'svg',
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
        name: '_channelOwner',
        type: 'address',
      },
    ],
    name: 'hasTask',
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
        internalType: 'string',
        name: 'numString',
        type: 'string',
      },
    ],
    name: 'st2num',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'pure',
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
    name: 'task',
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
        name: '_contract',
        type: 'address',
      },
      {
        internalType: 'string',
        name: '_description',
        type: 'string',
      },
    ],
    name: 'updateDescription',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_str',
        type: 'string',
      },
    ],
    name: 'updateSVGTask',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
