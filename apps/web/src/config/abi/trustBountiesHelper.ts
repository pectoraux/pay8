export const trustBountiesHelperABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'bountyId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'partnerBounty',
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
        name: 'endTime',
        type: 'uint256',
      },
    ],
    name: 'AddApproval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'bountyId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'source',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'balanceAmount',
        type: 'uint256',
      },
    ],
    name: 'AddBalance',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'bountyId',
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
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'parentBountyId',
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
        name: 'bountySource',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'avatar',
        type: 'string',
      },
    ],
    name: 'CreateBounty',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'claimId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'bountyId',
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
        internalType: 'address',
        name: 'hunter',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'friendly',
        type: 'bool',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'atPeace',
        type: 'bool',
      },
    ],
    name: 'CreateClaim',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'bountyId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'source',
        type: 'address',
      },
    ],
    name: 'DeleteBalance',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'bountyId',
        type: 'uint256',
      },
    ],
    name: 'DeleteBounty',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'bountyId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'partnerBounty',
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
        internalType: 'bool',
        name: 'deactivate',
        type: 'bool',
      },
    ],
    name: 'RemoveApproval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address[]',
        name: 'factories',
        type: 'address[]',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'add',
        type: 'bool',
      },
    ],
    name: 'UpdateAuthorizedSourceFactories',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'bountyId',
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
        name: 'avatar',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'terms',
        type: 'string',
      },
    ],
    name: 'UpdateBounty',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'claimId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'winner',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'endTime',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'atPeace',
        type: 'bool',
      },
    ],
    name: 'UpdateClaim',
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
        indexed: false,
        internalType: 'address[]',
        name: 'tokens',
        type: 'address[]',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'add',
        type: 'bool',
      },
    ],
    name: 'UpdateWhitelistedTokens',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_bountyId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_source',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_tokenId',
        type: 'uint256',
      },
    ],
    name: 'addBalanceETH',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'appealWindow',
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
        name: '_bountyId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_claimId',
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
        name: '_tag',
        type: 'string',
      },
    ],
    name: 'applyClaimResultsETH',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_bountyId',
        type: 'uint256',
      },
    ],
    name: 'attach',
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
    name: 'attachments',
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
    name: 'balanceBuffer',
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
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256[]',
        name: '_bountyNTokenId',
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
    name: 'canAttach',
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
    inputs: [
      {
        internalType: 'uint256',
        name: '_bountyId',
        type: 'uint256',
      },
    ],
    name: 'detach',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_bountyId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_partnerBounty',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_endTime',
        type: 'uint256',
      },
    ],
    name: 'emitAddApproval',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_bountyId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_source',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_balanceAmount',
        type: 'uint256',
      },
    ],
    name: 'emitAddBalance',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'bountyId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'parentBountyId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'collectionId',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'bountySource',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'avatar',
        type: 'string',
      },
    ],
    name: 'emitCreateBounty',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_claimId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_bountyId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_hunter',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: '_friendly',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: '_atPeace',
        type: 'bool',
      },
    ],
    name: 'emitCreateClaim',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_bountyId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_source',
        type: 'address',
      },
    ],
    name: 'emitDeleteBalance',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_bountyId',
        type: 'uint256',
      },
    ],
    name: 'emitDeleteBounty',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_bountyId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_partnerBounty',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: '_deactivate',
        type: 'bool',
      },
    ],
    name: 'emitRemoveApproval',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'bountyId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'collectionId',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'avatar',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'terms',
        type: 'string',
      },
    ],
    name: 'emitUpdateBounty',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_claimId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_endTime',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: '_atPeace',
        type: 'bool',
      },
      {
        internalType: 'address',
        name: '_winner',
        type: 'address',
      },
    ],
    name: 'emitUpdateClaim',
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
        name: '_start',
        type: 'uint256',
      },
    ],
    name: 'getAuthorizedSourceFactories',
    outputs: [
      {
        internalType: 'address[]',
        name: '_factories',
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
        name: '_bountyId',
        type: 'uint256',
      },
    ],
    name: 'getLatestClaimId',
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
        name: '_start',
        type: 'uint256',
      },
    ],
    name: 'getWhitelistedTokens',
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
        internalType: 'address',
        name: '_token',
        type: 'address',
      },
    ],
    name: 'isAuthorizedSourceFactories',
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
        name: '_ve',
        type: 'address',
      },
    ],
    name: 'isVe',
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
    ],
    name: 'isWhiteListed',
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
    name: 'minLockPeriod',
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
    name: 'minToClaim',
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
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    name: 'onERC1155BatchReceived',
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
    name: 'onERC1155Received',
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
        internalType: 'uint256',
        name: '_bountyId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'safeTransfer',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_bountyId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'safeTransferFrom',
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
    inputs: [],
    name: 'tradingNFTFee',
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
        internalType: 'address[]',
        name: '_factories',
        type: 'address[]',
      },
      {
        internalType: 'bool',
        name: '_add',
        type: 'bool',
      },
    ],
    name: 'updateAuthorizedSourceFactories',
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
    name: 'updateCanAttach',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_minLockPeriod',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_balanceBuffer',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_appealWindow',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_tradingFee',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_tradingNFTFee',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_minToClaim',
        type: 'uint256',
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
        name: '_ve',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: '_add',
        type: 'bool',
      },
    ],
    name: 'updateVes',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: '_tokens',
        type: 'address[]',
      },
      {
        internalType: 'bool',
        name: '_add',
        type: 'bool',
      },
    ],
    name: 'updateWhitelistedTokens',
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
    name: 'ves',
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
