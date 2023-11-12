export const veFactoryABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token_addr',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_valuepool',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: '_riskpool',
        type: 'bool',
      },
    ],
    name: 'createVe',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
