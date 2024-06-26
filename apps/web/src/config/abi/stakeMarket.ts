export const stakeMarketABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_contractAddress',
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
        name: 'stakeId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'owner',
        type: 'address',
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
        name: 'time',
        type: 'uint256',
      },
    ],
    name: 'AddToStake',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'stakeId',
        type: 'uint256',
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
        name: 'partnerStakeId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'time',
        type: 'uint256',
      },
    ],
    name: 'ApplyToStake',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'stakeId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'time',
        type: 'uint256',
      },
    ],
    name: 'CancelStake',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'stakeId',
        type: 'uint256',
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
        name: 'applicationId',
        type: 'uint256',
      },
    ],
    name: 'DeleteApplication',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'stakeId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'partnerStakeId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'time',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'closedStake',
        type: 'bool',
      },
    ],
    name: 'LockStake',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'stakeId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'time',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'stakeSource',
        type: 'string',
      },
    ],
    name: 'StakeCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'stakeId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'owner',
        type: 'address',
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
        name: 'time',
        type: 'uint256',
      },
    ],
    name: 'UnlockStake',
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
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'stakeId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: '_newOwner',
        type: 'address',
      },
    ],
    name: 'UpdateOwner',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'stakeId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'terms',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'countries',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'cities',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'products',
        type: 'string',
      },
    ],
    name: 'UpdateRequirements',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_stakeId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
    ],
    name: 'addToStake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_stakeId',
        type: 'uint256',
      },
    ],
    name: 'cancelStake',
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
        name: '_tokenId',
        type: 'uint256',
      },
    ],
    name: 'claimRevenueFromNote',
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
    name: 'closedStake',
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
        name: '_user',
        type: 'address',
      },
      {
        internalType: 'uint256[7]',
        name: '_bankInfo',
        type: 'uint256[7]',
      },
      {
        internalType: 'uint256',
        name: '_deadline',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_identityTokenId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_partnerStakeId',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: '_stakeSource',
        type: 'string',
      },
    ],
    name: 'createAndApply',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_attackerId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_defenderId',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: '_title',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_content',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_tags',
        type: 'string',
      },
    ],
    name: 'createGauge',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[6]',
        name: '_addrs',
        type: 'address[6]',
      },
      {
        internalType: 'string',
        name: '_tokenId',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_stakeSource',
        type: 'string',
      },
      {
        internalType: 'uint256[]',
        name: '_options',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256',
        name: '_userTokenId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_identityTokenId',
        type: 'uint256',
      },
      {
        internalType: 'uint256[7]',
        name: '_bankInfo',
        type: 'uint256[7]',
      },
      {
        internalType: 'bool',
        name: '_requireUpfrontPayment',
        type: 'bool',
      },
    ],
    name: 'createStake',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
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
        name: '_stakeId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_partnerStakeId',
        type: 'uint256',
      },
    ],
    name: 'deleteApplication',
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
        name: '_stakeId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_start',
        type: 'uint256',
      },
    ],
    name: 'getAllApplications',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '_stakeIds',
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
        name: '_stakeId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_start',
        type: 'uint256',
      },
    ],
    name: 'getAllPartners',
    outputs: [
      {
        internalType: 'uint256[]',
        name: 'p',
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
        name: '_stakeId',
        type: 'uint256',
      },
    ],
    name: 'getOwner',
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
        name: '_stakeId',
        type: 'uint256',
      },
    ],
    name: 'getStake',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 've',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'token',
            type: 'address',
          },
          {
            internalType: 'string',
            name: 'tokenId',
            type: 'string',
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
                name: 'startPayable',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'startReceivable',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'amountPayable',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'amountReceivable',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'periodPayable',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'periodReceivable',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'paidPayable',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'paidReceivable',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'gasPercent',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'waitingPeriod',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'stakeRequired',
                type: 'uint256',
              },
            ],
            internalType: 'struct Bank',
            name: 'bank',
            type: 'tuple',
          },
          {
            internalType: 'uint256',
            name: 'profileId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'bountyId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'parentStakeId',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'profileRequired',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'bountyRequired',
            type: 'bool',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'source',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'collection',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'referrer',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'userTokenId',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'identityTokenId',
                type: 'uint256',
              },
              {
                internalType: 'uint256[]',
                name: 'options',
                type: 'uint256[]',
              },
            ],
            internalType: 'struct MetaData',
            name: 'metadata',
            type: 'tuple',
          },
          {
            internalType: 'enum AGREEMENT',
            name: 'ownerAgreement',
            type: 'uint8',
          },
        ],
        internalType: 'struct Stake',
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
    ],
    name: 'isStake',
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
        internalType: 'uint256',
        name: '_applicationId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_stakeId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_startPayable',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: '_closeStake',
        type: 'bool',
      },
    ],
    name: 'lockStake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_stakeId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_numPeriods',
        type: 'uint256',
      },
    ],
    name: 'mintNote',
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
    name: 'notes',
    outputs: [
      {
        internalType: 'uint256',
        name: 'due',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'nextDue',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'stakeId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'token',
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
    name: 'stakeStatus',
    outputs: [
      {
        internalType: 'enum StakeStatusEnum',
        name: 'status',
        type: 'uint8',
      },
      {
        internalType: 'uint256',
        name: 'endTime',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'winnerId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'loserId',
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
    name: 'stakesApplication',
    outputs: [
      {
        internalType: 'enum ApplicationStatus',
        name: 'status',
        type: 'uint8',
      },
      {
        internalType: 'uint256',
        name: 'stakeId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'deadline',
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
    name: 'stakesBalances',
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
        name: '_stakeId',
        type: 'uint256',
      },
    ],
    name: 'switchStake',
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
        internalType: 'uint256',
        name: '_stakeId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: '_removePartner',
        type: 'bool',
      },
    ],
    name: 'unlockStake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_stakeId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_newOwner',
        type: 'address',
      },
    ],
    name: 'updateOwner',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_stakeId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_profileId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_bountyId',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: '_profileRequired',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: '_bountyRequired',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: '_stakeRequired',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_gasPercent',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: '_terms',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_countries',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_cities',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_products',
        type: 'string',
      },
    ],
    name: 'updateRequirements',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_stakeId',
        type: 'uint256',
      },
      {
        internalType: 'enum AGREEMENT',
        name: 'agreement',
        type: 'uint8',
      },
    ],
    name: 'updateStake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_winnerId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_loserId',
        type: 'uint256',
      },
    ],
    name: 'updateStakeFromVoter',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_stakeId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_amountPayable',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_amountReceivable',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_source',
        type: 'address',
      },
    ],
    name: 'updateStaked',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_attackerId',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: '_title',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_content',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_tags',
        type: 'string',
      },
    ],
    name: 'updateStatusOrAppeal',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_stakeId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_taxContract',
        type: 'address',
      },
    ],
    name: 'updateTaxContract',
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
    name: 'waitingPeriodDeadline',
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
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
