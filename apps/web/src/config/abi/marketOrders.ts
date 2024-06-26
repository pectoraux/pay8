export const marketOrdersABI = [
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
        internalType: 'string',
        name: '_tokenId',
        type: 'string',
      },
      {
        internalType: 'uint256[3]',
        name: '_vals',
        type: 'uint256[3]',
      },
    ],
    name: 'addReferral',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '__tokenId',
        type: 'string',
      },
    ],
    name: 'cancelAskOrder',
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
        internalType: 'uint256',
        name: '_askPrice',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_bidDuration',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_minBidIncrementPercentage',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: '_transferrable',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: '_requireUpfrontPayment',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: '_usetFIAT',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: '_rsrcTokenId',
        type: 'uint256',
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
        internalType: 'address',
        name: '_tFIAT',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_ve',
        type: 'address',
      },
    ],
    name: 'createAskOrder',
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
        internalType: 'bytes32',
        name: '_tokenId',
        type: 'bytes32',
      },
    ],
    name: 'decrementMaxSupply',
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
        name: '_collectionId',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: '_tokenId',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: '_price',
        type: 'uint256',
      },
    ],
    name: 'decrementPaymentCredits',
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
        internalType: 'bytes32',
        name: '_tokenId',
        type: 'bytes32',
      },
    ],
    name: 'getAskDetails',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'seller',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'price',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'lastBidder',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'bidDuration',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'lastBidTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'minBidIncrementPercentage',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'rsrcTokenId',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'transferrable',
            type: 'bool',
          },
          {
            components: [
              {
                internalType: 'enum Status',
                name: 'discountStatus',
                type: 'uint8',
              },
              {
                internalType: 'uint256',
                name: 'discountStart',
                type: 'uint256',
              },
              {
                internalType: 'enum Status',
                name: 'cashbackStatus',
                type: 'uint8',
              },
              {
                internalType: 'uint256',
                name: 'cashbackStart',
                type: 'uint256',
              },
              {
                internalType: 'bool',
                name: 'cashNotCredit',
                type: 'bool',
              },
              {
                internalType: 'bool',
                name: 'checkItemOnly',
                type: 'bool',
              },
              {
                internalType: 'bool',
                name: 'checkIdentityCode',
                type: 'bool',
              },
              {
                components: [
                  {
                    internalType: 'uint256',
                    name: 'cursor',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'size',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'perct',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'lowerThreshold',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'upperThreshold',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'limit',
                    type: 'uint256',
                  },
                ],
                internalType: 'struct Discount',
                name: 'discountNumbers',
                type: 'tuple',
              },
              {
                components: [
                  {
                    internalType: 'uint256',
                    name: 'cursor',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'size',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'perct',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'lowerThreshold',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'upperThreshold',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'limit',
                    type: 'uint256',
                  },
                ],
                internalType: 'struct Discount',
                name: 'discountCost',
                type: 'tuple',
              },
              {
                components: [
                  {
                    internalType: 'uint256',
                    name: 'cursor',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'size',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'perct',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'lowerThreshold',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'upperThreshold',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'limit',
                    type: 'uint256',
                  },
                ],
                internalType: 'struct Discount',
                name: 'cashbackNumbers',
                type: 'tuple',
              },
              {
                components: [
                  {
                    internalType: 'uint256',
                    name: 'cursor',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'size',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'perct',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'lowerThreshold',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'upperThreshold',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'limit',
                    type: 'uint256',
                  },
                ],
                internalType: 'struct Discount',
                name: 'cashbackCost',
                type: 'tuple',
              },
            ],
            internalType: 'struct PriceReductor',
            name: 'priceReductor',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'string',
                name: 'requiredIndentity',
                type: 'string',
              },
              {
                internalType: 'enum COLOR',
                name: 'minIDBadgeColor',
                type: 'uint8',
              },
              {
                internalType: 'string',
                name: 'valueName',
                type: 'string',
              },
              {
                internalType: 'uint256',
                name: 'maxUse',
                type: 'uint256',
              },
              {
                internalType: 'bool',
                name: 'dataKeeperOnly',
                type: 'bool',
              },
              {
                internalType: 'bool',
                name: 'onlyTrustWorthyAuditors',
                type: 'bool',
              },
            ],
            internalType: 'struct IdentityProof',
            name: 'identityProof',
            type: 'tuple',
          },
          {
            internalType: 'uint256',
            name: 'maxSupply',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'dropinTimer',
            type: 'uint256',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'tFIAT',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 've',
                type: 'address',
              },
              {
                internalType: 'bool',
                name: 'usetFIAT',
                type: 'bool',
              },
              {
                internalType: 'bool',
                name: 'requireUpfrontPayment',
                type: 'bool',
              },
            ],
            internalType: 'struct TokenInfo',
            name: 'tokenInfo',
            type: 'tuple',
          },
        ],
        internalType: 'struct Ask',
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
        name: '_collectionId',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: '_tokenId',
        type: 'string',
      },
    ],
    name: 'getAskOrder',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'seller',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'price',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'lastBidder',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'bidDuration',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'lastBidTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'minBidIncrementPercentage',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'rsrcTokenId',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'transferrable',
            type: 'bool',
          },
          {
            components: [
              {
                internalType: 'enum Status',
                name: 'discountStatus',
                type: 'uint8',
              },
              {
                internalType: 'uint256',
                name: 'discountStart',
                type: 'uint256',
              },
              {
                internalType: 'enum Status',
                name: 'cashbackStatus',
                type: 'uint8',
              },
              {
                internalType: 'uint256',
                name: 'cashbackStart',
                type: 'uint256',
              },
              {
                internalType: 'bool',
                name: 'cashNotCredit',
                type: 'bool',
              },
              {
                internalType: 'bool',
                name: 'checkItemOnly',
                type: 'bool',
              },
              {
                internalType: 'bool',
                name: 'checkIdentityCode',
                type: 'bool',
              },
              {
                components: [
                  {
                    internalType: 'uint256',
                    name: 'cursor',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'size',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'perct',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'lowerThreshold',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'upperThreshold',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'limit',
                    type: 'uint256',
                  },
                ],
                internalType: 'struct Discount',
                name: 'discountNumbers',
                type: 'tuple',
              },
              {
                components: [
                  {
                    internalType: 'uint256',
                    name: 'cursor',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'size',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'perct',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'lowerThreshold',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'upperThreshold',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'limit',
                    type: 'uint256',
                  },
                ],
                internalType: 'struct Discount',
                name: 'discountCost',
                type: 'tuple',
              },
              {
                components: [
                  {
                    internalType: 'uint256',
                    name: 'cursor',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'size',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'perct',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'lowerThreshold',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'upperThreshold',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'limit',
                    type: 'uint256',
                  },
                ],
                internalType: 'struct Discount',
                name: 'cashbackNumbers',
                type: 'tuple',
              },
              {
                components: [
                  {
                    internalType: 'uint256',
                    name: 'cursor',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'size',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'perct',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'lowerThreshold',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'upperThreshold',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'limit',
                    type: 'uint256',
                  },
                ],
                internalType: 'struct Discount',
                name: 'cashbackCost',
                type: 'tuple',
              },
            ],
            internalType: 'struct PriceReductor',
            name: 'priceReductor',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'string',
                name: 'requiredIndentity',
                type: 'string',
              },
              {
                internalType: 'enum COLOR',
                name: 'minIDBadgeColor',
                type: 'uint8',
              },
              {
                internalType: 'string',
                name: 'valueName',
                type: 'string',
              },
              {
                internalType: 'uint256',
                name: 'maxUse',
                type: 'uint256',
              },
              {
                internalType: 'bool',
                name: 'dataKeeperOnly',
                type: 'bool',
              },
              {
                internalType: 'bool',
                name: 'onlyTrustWorthyAuditors',
                type: 'bool',
              },
            ],
            internalType: 'struct IdentityProof',
            name: 'identityProof',
            type: 'tuple',
          },
          {
            internalType: 'uint256',
            name: 'maxSupply',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'dropinTimer',
            type: 'uint256',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'tFIAT',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 've',
                type: 'address',
              },
              {
                internalType: 'bool',
                name: 'usetFIAT',
                type: 'bool',
              },
              {
                internalType: 'bool',
                name: 'requireUpfrontPayment',
                type: 'bool',
              },
            ],
            internalType: 'struct TokenInfo',
            name: 'tokenInfo',
            type: 'tuple',
          },
        ],
        internalType: 'struct Ask',
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
        name: '_user',
        type: 'address',
      },
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
    name: 'getPaymentCredits',
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
        name: '_collectionId',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: '_tokenId',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: '_price',
        type: 'uint256',
      },
    ],
    name: 'incrementPaymentCredits',
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
        internalType: 'string',
        name: '_tokenId',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: '_newPrice',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_bidDuration',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_minBidIncrementPercentage',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: '_transferrable',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: '_requireUpfrontPayment',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: '_rsrcTokenId',
        type: 'uint256',
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
    ],
    name: 'modifyAskOrder',
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
        internalType: 'enum Status',
        name: '_cashbackStatus',
        type: 'uint8',
      },
      {
        internalType: 'uint256',
        name: '_cashbackStart',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: '_checkItemOnly',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: '_cashNotCredit',
        type: 'bool',
      },
      {
        internalType: 'uint256[6]',
        name: '__cashbackNumbers',
        type: 'uint256[6]',
      },
      {
        internalType: 'uint256[6]',
        name: '__cashbackCost',
        type: 'uint256[6]',
      },
    ],
    name: 'modifyAskOrderCashbackPriceReductors',
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
        internalType: 'enum Status',
        name: '_discountStatus',
        type: 'uint8',
      },
      {
        internalType: 'uint256',
        name: '_discountStart',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: '_cashNotCredit',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: '_checkItemOnly',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: '_checkIdentityCode',
        type: 'bool',
      },
      {
        internalType: 'uint256[6]',
        name: '__discountNumbers',
        type: 'uint256[6]',
      },
      {
        internalType: 'uint256[6]',
        name: '__discountCost',
        type: 'uint256[6]',
      },
    ],
    name: 'modifyAskOrderDiscountPriceReductors',
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
        internalType: 'string',
        name: '_requiredIndentity',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_valueName',
        type: 'string',
      },
      {
        internalType: 'bool',
        name: '_onlyTrustWorthyAuditors',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: '_dataKeeperOnly',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: '_maxUse',
        type: 'uint256',
      },
      {
        internalType: 'enum COLOR',
        name: '_minIDBadgeColor',
        type: 'uint8',
      },
    ],
    name: 'modifyAskOrderIdentity',
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
        internalType: 'uint256',
        name: '_collectionId',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: '_tokenId',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: '_price',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_lastBidTime',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_lastBidder',
        type: 'address',
      },
    ],
    name: 'updateAfterSale',
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
        name: '_collectionId',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: '_tokenId',
        type: 'string',
      },
    ],
    name: 'updatePaymentCredits',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
