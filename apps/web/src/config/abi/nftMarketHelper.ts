export const nftMarketHelperABI = [
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
      {
        internalType: 'string',
        name: '_applyToTokenId',
        type: 'string',
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
        name: '_price',
        type: 'uint256',
      },
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
        internalType: 'string',
        name: '_tokenId',
        type: 'string',
      },
    ],
    name: 'checkAuction',
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
        name: '_item',
        type: 'string',
      },
      {
        internalType: 'uint256[]',
        name: '_indices',
        type: 'uint256[]',
      },
    ],
    name: 'getOptions',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'min',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'max',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'unitPrice',
            type: 'uint256',
          },
          {
            internalType: 'string',
            name: 'category',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'element',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'traitType',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'value',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'currency',
            type: 'string',
          },
        ],
        internalType: 'struct Option[]',
        name: 'opt',
        type: 'tuple[]',
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
        internalType: 'string',
        name: '_tokenId',
        type: 'string',
      },
      {
        internalType: 'uint256[]',
        name: '_options',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256',
        name: '_identityTokenId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_price',
        type: 'uint256',
      },
    ],
    name: 'getRealPrice',
    outputs: [
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
        internalType: 'address',
        name: '_referrer',
        type: 'address',
      },
      {
        internalType: 'string',
        name: '_tokenId',
        type: 'string',
      },
      {
        internalType: 'uint256[]',
        name: '_options',
        type: 'uint256[]',
      },
    ],
    name: 'mintNFTicket',
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
        internalType: 'address',
        name: '_referrer',
        type: 'address',
      },
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
        name: '_userTokenId',
        type: 'uint256',
      },
      {
        internalType: 'uint256[]',
        name: '_options',
        type: 'uint256[]',
      },
    ],
    name: 'processAuction',
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
        internalType: 'address',
        name: '_referrer',
        type: 'address',
      },
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
        name: '_userTokenId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_price',
        type: 'uint256',
      },
      {
        internalType: 'uint256[]',
        name: '_options',
        type: 'uint256[]',
      },
    ],
    name: 'processTrade',
    outputs: [],
    stateMutability: 'nonpayable',
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
        internalType: 'string',
        name: '_tokenId',
        type: 'string',
      },
      {
        internalType: 'uint256[]',
        name: '_mins',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: '_maxs',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: '_unitPrices',
        type: 'uint256[]',
      },
      {
        internalType: 'string[]',
        name: '_categories',
        type: 'string[]',
      },
      {
        internalType: 'string[]',
        name: '_elements',
        type: 'string[]',
      },
      {
        internalType: 'string[]',
        name: '_traitTypes',
        type: 'string[]',
      },
      {
        internalType: 'string[]',
        name: '_values',
        type: 'string[]',
      },
      {
        internalType: 'string[]',
        name: '_currencies',
        type: 'string[]',
      },
    ],
    name: 'updateOptions',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
