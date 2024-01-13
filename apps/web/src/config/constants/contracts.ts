import { masterChefV3Addresses } from '@pancakeswap/farms'
import { DEPLOYER_ADDRESSES } from '@pancakeswap/v3-sdk'
import { V3_QUOTER_ADDRESSES } from '@pancakeswap/smart-router/evm'

export default {
  masterChef: {
    97: '0xB4A466911556e39210a6bB2FaECBB59E4eB7E43d',
    56: '0xa5f8C5Dbd5F286960b9d90548680aE5ebFf07652',
  },
  masterChefV3: masterChefV3Addresses,
  masterChefV1: {
    97: '0x1d32c2945C8FDCBc7156c553B7cEa4325a17f4f9',
    56: '0x73feaa1eE314F8c655E354234017bE2193C9E24E',
  },
  sousChef: {
    97: '0xd3af5fe61dbaf8f73149bfcfa9fb653ff096029a',
    56: '0x6ab8463a4185b80905e05a9ff80a2d6b714b9e95',
  },
  lotteryV2: {
    97: '0x5790c3534F30437641541a0FA04C992799602998',
    56: '0x5aF6D33DE2ccEC94efb1bDF8f92Bd58085432d2c',
  },
  multiCall: {
    1: '0xcA11bde05977b3631167028862bE2a173976CA11',
    4: '0xcA11bde05977b3631167028862bE2a173976CA11',
    5: '0xcA11bde05977b3631167028862bE2a173976CA11',
    56: '0xcA11bde05977b3631167028862bE2a173976CA11',
    97: '0xcA11bde05977b3631167028862bE2a173976CA11',
    280: '0xF9cda624FBC7e059355ce98a31693d299FACd963',
    324: '0xF9cda624FBC7e059355ce98a31693d299FACd963',
    4002: '0xcA11bde05977b3631167028862bE2a173976CA11',
  },
  pancakeProfile: {
    56: '0xDf4dBf6536201370F95e06A0F8a7a70fE40E388a',
    97: '0x4B683C7E13B6d5D7fd1FeA9530F451954c1A7c8A',
  },
  pancakeBunnies: {
    56: '0xDf7952B35f24aCF7fC0487D01c8d5690a60DBa07',
    97: '0x60935F36e4631F73f0f407e68642144e07aC7f5E',
  },
  bunnyFactory: {
    56: '0xfa249Caa1D16f75fa159F7DFBAc0cC5EaB48CeFf',
    97: '0x707CBF373175fdB601D34eeBF2Cf665d08f01148',
  },
  claimRefund: {
    56: '0xE7e53A7e9E3Cf6b840f167eF69519175c497e149',
    97: '0x',
  },
  pointCenterIfo: {
    56: '0x3C6919b132462C1FEc572c6300E83191f4F0012a',
    97: '0xd2Ac1B1728Bb1C11ae02AB6e75B76Ae41A2997e3',
  },
  bunnySpecial: {
    56: '0xFee8A195570a18461146F401d6033f5ab3380849',
    97: '0x7b7b1583De1DeB32Ce6605F6deEbF24A0671c17C',
  },
  tradingCompetitionEaster: {
    56: '0xd718baa0B1F4f70dcC8458154042120FFE0DEFFA',
    97: '0xC787F45B833721ED3aC46E99b703B3E1E01abb97',
  },
  tradingCompetitionFanToken: {
    56: '0xA8FECf847e28aa1Df39E995a45b7FCfb91b676d4',
    97: '0x',
  },
  tradingCompetitionMobox: {
    56: '0x1C5161CdB145dE35a8961F82b065fd1F75C3BaDf',
    97: '0x',
  },
  tradingCompetitionMoD: {
    56: '0xbDd9a61c67ee16c10f5E37b1D0c907a9EC959f33',
    97: '0x',
  },
  easterNft: {
    56: '0x23c41D28A239dDCAABd1bb1deF8d057189510066',
    97: '0x24ec6962dbe874F6B67B5C50857565667fA0854F',
  },
  cakeVault: {
    56: '0x45c54210128a065de780C4B0Df3d16664f7f859e',
    97: '0x1088Fb24053F03802F673b84d16AE1A7023E400b',
  },
  cakeFlexibleSideVault: {
    56: '0x615e896A8C2CA8470A2e9dc2E9552998f8658Ea0',
    97: '0x1088Fb24053F03802F673b84d16AE1A7023E400b',
  },
  predictionsBNB: {
    56: '0x18B2A687610328590Bc8F2e5fEdDe3b582A49cdA',
    97: '0x',
  },
  predictionsCAKE: {
    56: '0x0E3A8078EDD2021dadcdE733C6b4a86E51EE8f07',
    97: '0x',
  },
  chainlinkOracleBNB: {
    56: '0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE',
    97: '0x',
  },
  chainlinkOracleCAKE: {
    56: '0xB6064eD41d4f67e353768aA239cA86f4F73665a1',
    97: '0x',
  },
  predictionsV1: {
    56: '0x516ffd7d1e0ca40b1879935b2de87cb20fc1124b',
    97: '0x',
  },
  bunnySpecialCakeVault: {
    56: '0x5B4a770Abe7Eafb2601CA4dF9d73EA99363E60a4',
    97: '0x',
  },
  bunnySpecialPrediction: {
    56: '0x342c99e9aC24157657095eC69CB04b73257e7A9C',
    97: '0x',
  },
  bunnySpecialLottery: {
    56: '0x24ED31d31C5868e5a96aA77fdcB890f3511fa0b2',
    97: '0x382cB497110F398F0f152cae82821476AE51c9cF',
  },
  bunnySpecialXmas: {
    56: '0x59EdDF3c21509dA3b0aCCd7c5ccc596d930f4783',
    97: '0x',
  },
  farmAuction: {
    56: '0xb92Ab7c1edcb273AbA24b0656cEb3681654805D2',
    97: '0x3F9602593b4f7C67ab045DB51BbDEa94E40fA9Fe',
  },
  nftMarket: {
    56: '0x17539cCa21C7933Df5c980172d22659B8C345C5A',
    97: '0x7f9f37ddcaa33893f9beb3d8748c8d6bfbde6ab2',
  },
  nftSale: {
    56: '0x29fE7148636b7Ae0b1E53777b28dfbaA9327af8E',
    97: '0xe486De509c5381cbdBF3e71F57D7F1f7570f5c46',
  },
  pancakeSquad: {
    56: '0x0a8901b0E25DEb55A87524f0cC164E9644020EBA',
    97: '0xfC0c3F11fDA72Cb9A56F28Ec8D44C0ae4B3ABF86',
  },
  potteryDraw: {
    56: '0x01871991587d5671f3A2d4E2BcDC22F4E026396e',
    97: '0xDB9D365b50E62fce747A90515D2bd1254A16EbB9',
  },
  zap: {
    56: '0xD4c4a7C55c9f7B3c48bafb6E8643Ba79F42418dF',
    97: '0xD85835207054F25620109bdc745EC1D1f84F04e1',
    4002: '0x0c564a8A570fEC58A6303f975330F6822dE388CC',
  },
  stableSwapNativeHelper: {
    56: '0x52E5D1e24A4308ef1A221C949cb2F7cbbAFEE090',
    97: '0x6e4B1D7C65E86f1723720a5fE8993f0908108b64',
  },
  iCake: {
    56: '0x3C458828D1622F5f4d526eb0d24Da8C4Eb8F07b1',
    97: '0x',
  },
  bCakeFarmBooster: {
    56: '0xE4FAa3Ef5A9708C894435B0F39c2B440936A3A52',
    97: '0x',
  },
  bCakeFarmBoosterProxyFactory: {
    56: '0x2C36221bF724c60E9FEE3dd44e2da8017a8EF3BA',
    97: '0x',
  },
  bCakeFarmBoosterV3: {
    56: '0x695170faE243147b3bEB4C43AA8DE5DcD9202752',
    97: '0x56666300A1E25624489b661f3C6c456c159a109a',
  },
  nonBscVault: {
    1: '0x2e71B2688019ebdFDdE5A45e6921aaebb15b25fb',
    5: '0xE6c904424417D03451fADd6E3f5b6c26BcC43841',
  },
  crossFarmingSender: {
    1: '0x8EA90Ef07f37c77137453C7A1B72B7886d51eCFb',
    5: '0x327d26dE30f92600620A99043034e0A5FD9402C8',
  },
  crossFarmingReceiver: {
    56: '0x0726a8C8206b9eC0AfB788df5adb36a8AEDB13c2',
    97: '0xBab5d3B6bA24E185f216419f3ba07f03984bF983',
  },
  mmLinkedPool: {
    1: '0x9Ca2A439810524250E543BA8fB6E88578aF242BC',
    5: '0x7bb894Ca487568dD55054193c3238d7B1f46BB92',
    56: '0xfEACb05b373f1A08E68235bA7FC92636b92ced01',
  },
  tradingReward: {
    1: '0x',
    56: '0xa842a4AD40FEbbd034fbeF25C7a880464a90e695',
    97: '0x',
  },
  nftPositionManager: {
    1: '0x46A15B0b27311cedF172AB29E4f4766fbE7F4364',
    5: '0x427bF5b37357632377eCbEC9de3626C71A5396c1',
    56: '0x46A15B0b27311cedF172AB29E4f4766fbE7F4364',
    97: '0x427bF5b37357632377eCbEC9de3626C71A5396c1',
    4002: '0x7BAd70d5192a6189dD8122D3200FD06264d8EA07',
    // TODO: new chains
    280: '0xF84697CfE7c88F846e4ba5dAe14A6A8f67deF5c2',
    324: '0x',
    1101: '0x46A15B0b27311cedF172AB29E4f4766fbE7F4364',
    1442: '0x1f489dd5B559E976AE74303F939Cfd0aF1b62C2B',
    42161: '0x46A15B0b27311cedF172AB29E4f4766fbE7F4364',
    59140: '0xacFa791C833120c769Fd3066c940B7D30Cd8BC73',
    421613: '0xb10120961f7504766976A89E29802Fa00553da5b',
  },
  v3PoolDeployer: DEPLOYER_ADDRESSES,
  v3Migrator: {
    1: '0xbC203d7f83677c7ed3F7acEc959963E7F4ECC5C2',
    5: '0x46A15B0b27311cedF172AB29E4f4766fbE7F4364',
    56: '0xbC203d7f83677c7ed3F7acEc959963E7F4ECC5C2',
    97: '0x46A15B0b27311cedF172AB29E4f4766fbE7F4364',
    4002: '0x922cE1fAC657cf3c9215c4c49C90083a54dBa230',
    // TODO: new chains
    280: '0x7627931617A60Fe58EDBf4881ac166E1eDe2379e',
    324: '0x',
    1101: '0xbC203d7f83677c7ed3F7acEc959963E7F4ECC5C2',
    1442: '0x4A3902773F947ce028969db670E568fFC9524E8C',
    42161: '0xbC203d7f83677c7ed3F7acEc959963E7F4ECC5C2',
    59140: '0x3652Fc6EDcbD76161b8554388867d3dAb65eCA93',
    421613: '0xCcf770BdBD8ccC57a7a7ABff53825fD895a06238',
  },
  quoter: V3_QUOTER_ADDRESSES,
  v3Airdrop: {
    1: '0x',
    56: '0xe934d2C5bE5db0295A4de3177762A9E8c74Ae4f4',
    97: '0x',
  },
  affiliateProgram: {
    1: '0x',
    56: '0x92C73D90F709DFf7e5E7307e8F2EE20e39396b12',
    97: '0x1B8a475B5E5De05fB3Ac2D9ec3C2809fBF24e51c',
  },
  tradingRewardTopTrades: {
    1: '0x',
    56: '0x549d484F493b778A5c70638E30Fc6Dc6B2Dcc4c0',
    97: '0x',
  },
  rampHelper: {
    56: '0x',
    4002: '0xf6d10E93874d1e50831ecf41F504bE04Fd132517',
  },
  rampHelper2: {
    56: '0x',
    4002: '0x708577E958AeA3575Eb5D7648D35293CF7B80168',
  },
  rampFactory: {
    56: '0x',
    4002: '0xC09f65453cc668E0a12f3d94C98cF881190744EB',
  },
  rampAds: {
    56: '0x',
    4002: '0x1C57E1E05042312b47eB1258D58624c533F34cBB',
  },
  extraTokenFactory: {
    56: '0x',
    4002: '0x7bBE3f25fB3aD6768051774F9a92163e64867Fb3',
  },
  feeTo: {
    56: '0x',
    4002: '0x0Fe2B9DAE99b685ce57c7160eF01022e49843Ca6',
  },
  poolGauge: {
    56: '0x',
    4002: '0xf67A37d9431C7A87e0674978960B525D6487CFa6',
  },
  ARPNote: {
    56: '0x',
    4002: '0x3556453B74591e140D1F5C51a7849b1af05078c4',
  },
  ARPHelper: {
    56: '0x',
    4002: '0x6980f39460543772d46Bf161B0B0413EA2FfE42c',
  },
  ARPMinter: {
    56: '0x',
    4002: '0x67b42515bfc975F3a6240904E01D6F066096cB5F',
  },
  ARPFactory: {
    56: '0x',
    4002: '0x9eD7FE2A7C125A2D6E5E0a81B90185178708163E',
  },
  BILLNote: {
    56: '0x',
    4002: '0xF025a972E71D697B0Da86667faF6cF5F3454AD0D',
  },
  BILLHelper: {
    56: '0x',
    4002: '0x6c7014Dc578B717722F56Fb64cc4f7C65bB2a3E6',
  },
  BILLMinter: {
    56: '0x',
    4002: '0xaC50394D310A03d6587A31B98dC591EFaEDa967A',
  },
  BILLFactory: {
    56: '0x',
    4002: '0x3BD957Ca8bCF699Cc6728E05690432A4890c9C2a',
  },
  lottery: {
    56: '0x',
    4002: '0x3655bfE221e594e6Cee200dBA560400DAe3b89C6',
  },
  lotteryHelper: {
    56: '0x',
    4002: '0xB635fe5686C19aC309D76901593833a828170695',
  },
  lotteryRandomNumberGenerator: {
    56: '0x',
    4002: '0x63E751b3b4533918b2adC7b7F7127b5765559e13',
  },
  randomNumberGenerator: {
    56: '0x',
    4002: '0x131637F4d7B58d7061Ec00ceFAA4DBF66B968921',
  },
  gameFactory: {
    56: '0x',
    4002: '0x5397f008Ea054A368C4DFd664c42E9e22160B34b',
  },
  gameMinter: {
    56: '0x',
    4002: '0xdCfAc7BA16655F263aE8c45608129832399B147d',
  },
  gameHelper: {
    56: '0x',
    4002: '0x53ce30dF591D9c91999B8A37263643B04d7088f2',
  },
  gameHelper2: {
    56: '0x',
    4002: '0xa5B4a37b80857EE16D15c84EDe3950BFcEaE77e6',
  },
  paywallARPHelper: {
    56: '0x',
    4002: '0x46c803917E3E68525F1C435141ADd0aE4c76246f',
  },
  paywallARPFactory: {
    56: '0x',
    4002: '0x0e66291f9Fe09ceA0eC28d5c635e8E9bfb80a9F2',
  },
  minterFactory: {
    4002: '0xAcd5d04c9F143E1750C66E2022199e186E6a5Bbd',
    56: '0x',
  },
  nfticket: {
    4002: '0x6E202dbEE80E9A73709a55875Ad6f336D3C5aB71',
    56: '0x',
  },
  nfticketHelper: {
    4002: '0x7488bF1615432bEF6C654d5E50bC23f0E7BeE794',
    56: '0x',
  },
  nfticketHelper2: {
    4002: '0xd89685bA803882c2F387932320eA25faBA441fb4',
    56: '0x',
  },
  marketEvents: {
    4002: '0x5E62a90BDD1a3Da6E94fB5713E5E7e54516b95D7',
    56: '0x',
  },
  marketCollections: {
    4002: '0xb0984319AA46BBA3E90bE0a17070E785BCFF03Cd',
    56: '0x0000000000000000000000000000000000000000',
  },
  marketOrders: {
    4002: '0xe4eB8bD4B1c49a465aB7Da95176F4288bb7B4B35',
    56: '0x',
  },
  marketTrades: {
    4002: '0xb09f6D0D78F64bF419E17C5BDe9c5f20bC4938E2',
    56: '0x',
  },
  marketHelper: {
    4002: '0x501883DF86eeb3F5dd63F7b12D3be0bf0E85f900',
    56: '0x',
  },
  marketHelper2: {
    4002: '0xd7A476AC95A873c8ceB661AfB615dbcdE40d3e69',
    56: '0x',
  },
  marketHelper3: {
    4002: '0x28B0799396a8c45118E8A50a938E14ea50544104',
    56: '0x',
  },
  nftMarketOrders: {
    4002: '0x376Ad710Dc04b0e9a4dd2A67b76fCAb4A2a2Af55',
    56: '0x',
  },
  nftMarketTrades: {
    4002: '0x019a80F2Dfec67A8f796cE74a4Ab7A0d4F655c0E',
    56: '0x',
  },
  nftMarketHelper: {
    4002: '0xf0Aa17AF85aDf494a31DC0e10804d26071d45f08',
    56: '0x',
  },
  nftMarketHelper2: {
    4002: '0x921946CC84a0fC1E2394eD3aaeEF0c5a54BE6480',
    56: '0x',
  },
  nftMarketHelper3: {
    4002: '0x1F0D9be3815D63B3A2BC747500CBEbBbE6536219',
    56: '0x',
  },
  paywallMarketOrders: {
    4002: '0x8A3d077ce39f08962449Cdab4076F279D6AAAAC7',
    56: '0x',
  },
  paywallMarketTrades: {
    4002: '0x58CD669926351Cd4FE934315bE1f472ab32EB7DA',
    56: '0x',
  },
  paywallMarketHelper: {
    4002: '0x6635138A3Da2CED843598724CFc33877275d0C2F',
    56: '0x',
  },
  paywallMarketHelper2: {
    4002: '0x53FfA2AE9b4E5F461A8250A623B5BEbEE3a8C69a',
    56: '0x',
  },
  paywallMarketHelper3: {
    4002: '0x8d0259010F30CC3dcff49fD968A62d65A565966A',
    56: '0x',
  },
  stakemarket: {
    4002: '0xBb9B807DCD79c3Af7Fa1bCa2396EB424aE25Cc8F',
    56: '0x',
  },
  stakemarketNote: {
    4002: '0x9188eaFb296b6a99BB45858Ea58140287298D1eA',
    56: '0x',
  },
  stakemarketHelper: {
    4002: '0xC9DB6887a8017f8BD57F32bcdBCB3aB12aAE6BB8',
    56: '0x',
  },
  stakemarketVoter: {
    4002: '0x0F6dE1a86F2B0B82ec8C4831845aa2e96B7c6a5A',
    56: '0x',
  },
  stakemarketBribe: {
    4002: '0xA8ad12dd7708edeB2D18cB6CFB94fbB83bfa3909',
    56: '0x',
  },
  bettingHelper: {
    4002: '0x1B13e58320C0a7F490C9C576201506528C0D9Dc5',
    56: '0x',
  },
  bettingMinter: {
    4002: '0x22Ee373D092aF0626aE72Bc9124E68161ED38c90',
    56: '0x',
  },
  bettingFactory: {
    4002: '0x8f50058B663b5949DF59F6795A27A2552BD100B4',
    56: '0x',
  },
  trustbounties: {
    4002: '0x005541edE5cc4d1b561e39dB95DC3784F8BBB0b1',
    56: '0x',
  },
  trustbountiesHelper: {
    4002: '0xD5a3a5EfD62592BB3F5Fd7cC5f5B6c6D3712b33d',
    56: '0x',
  },
  trustbountiesvoter: {
    4002: '0x4Bb8E20BDAb5333ad0b91674CE1A3e3a34A181A8',
    56: '0x',
  },
  invoiceFactory: {
    4002: '0xC9F542F4A38349048FAE742d3C4136E69df23d77',
    56: '0x',
  },
  valuepoolVoter: {
    4002: '0x2cC04852fD270122e8B618D257460ED7c04dc7e0',
    56: '0x',
  },
  vaFactory: {
    4002: '0x485B9Edfb403cFb367A322471de56DBDd54a2f4d',
    56: '0x',
  },
  valuepoolFactory: {
    4002: '0x6395A7f0989eEa4d70ABe643847558cBD1f25CA0',
    56: '0x',
  },
  valuepoolHelper: {
    4002: '0x3235eF5716f10372575CB394EBac70C437F99c3F',
    56: '0x',
  },
  valuepoolHelper2: {
    4002: '0x41588Fa804a990dC0db34850f305a8c546a14d11',
    56: '0x',
  },
  businessVoter: {
    4002: '0x46a5a19D12ec1BEf43aCded2F00C64BE8FD2f1C8',
    56: '0x',
  },
  businessMinter: {
    4002: '0xBdf901C35FfA73f36dBF7FC88708Ce0Ab95089B6',
    56: '0x',
  },
  businessBribeFactory: {
    4002: '0x7d1A68Cd40EeEBbAC205e09b0C776bD9a21c7476',
    56: '0x',
  },
  businessGaugeFactory: {
    4002: '0x68909e3d5aaC70D18Ae26ED8F059A56B5B058037',
    56: '0x',
  },
  referralBribeFactory: {
    4002: '0xaec98A3EEA7B48f6a03A5750E92E896300295964',
    56: '0x',
  },
  referralVoter: {
    4002: '0x6604e6aEe666a8C6849a86a8519afdD92a888A46',
    56: '0x',
  },
  contractAddress: {
    4002: '0x57Cdd8692eF6FC8d195FcFd7601cF31c0e4e8B75',
    56: '0x',
  },
  acceleratorVoter: {
    4002: '0x514F785152Caa540A1c4FF0b7cd34E0c015E73a6',
    56: '0x',
  },
  contributorsVoter: {
    4002: '0x432e6406197b31A52Ac24E553aA8dDdBB573F219',
    56: '0x',
  },
  affiliatesVoter: {
    4002: '0x95f203aE002cA6b147dD9F4C9234ad59eF5f8E9B',
    56: '0x',
  },
  auditorNote: {
    4002: '0xA33A895b5340ACE5caf1930F5Bf2DAa41C5D100d',
    56: '0x',
  },
  auditorHelper: {
    4002: '0xdc912057B0AE36A8C861711A15600a7B393e84F7',
    56: '0x',
  },
  auditorHelper2: {
    4002: '0x1dC0EE2C95fEcB2EdD2d4737DB2ADEE844765a00',
    56: '0x',
  },
  auditorFactory: {
    4002: '0x030D43e6521bFc57bb00CfCe08D1D6eBCd52Dd36',
    56: '0x',
  },
  sponsorHelper: {
    4002: '0x2a76b60c7e58a66bc07dC628ae36595A349eB48C',
    56: '0x',
  },
  sponsorFactory: {
    4002: '0x30da46CF9e60D0bB7698fad4C000D98F53a69FB6',
    56: '0x',
  },
  plusCodes: {
    4002: '0x4F9EdF8a6DcF24b0AB7DBCe59F2AAcE3B23e4e71',
    56: '0x',
  },
  willNote: {
    4002: '0x76bedE2a8e6bb5190C3369593130fE134430Ef14',
    56: '0x',
  },
  willFactory: {
    4002: '0xa9cEFDE6ABa8Dd220bC3d46bdD9E9D9c6103b75C',
    56: '0x',
  },
  worldFactory: {
    4002: '0xdFe46b9CD5deA33635B50a5eDdc784a4e69C11bF',
    56: '0x',
  },
  worldNote: {
    4002: '0x78b55EC0b9371aC7966367327C96e5a2b03Be8e7',
    56: '0x',
  },
  worldHelper: {
    4002: '0xb846371BFc2aCD2fa8ad6Af10EA5bF8C01Ca7dC2',
    56: '0x',
  },
  worldHelper2: {
    4002: '0x4DDC7B7fDe5Ae29f8eeb08fF4a670826798DCc6d',
    56: '0x',
  },
  worldHelper3: {
    4002: '0x6ab8cF61b971102471ef6276A8eD8b7Cb5bC03E7',
    56: '0x',
  },
  ssi: {
    56: '0x',
    4002: '0x31733Bb298D9940Ed33a37fe88c53e6f56D31888',
  },
  card: {
    56: '0x',
    4002: '0x2147BC7403e33f24DFDb1aA2A26ae6DCf807b8e6',
  },
  futureCollaterals: {
    56: '0x',
    4002: '0x182a271B308Fef8F207FE0FA5f0A9B5f9891CC3D',
  },
  profile: {
    56: '0x',
    4002: '0x58EBF019aBB63CD93DE884D9DD4917515463d0eD',
  },
  profileHelper: {
    56: '0x',
    4002: '0x314b0242a5FfEf26c147E317eC8842bcd20f8640',
  },
  nftSVG: {
    56: '0x',
    4002: '0x4b81e883C13405D92F8986C06738Ff4Fa10d1573',
  },
  'real estate': {
    4002: '0xa68a8c8979dEdf77c4A36e05D06c6a6e803Bed33', // '0x0515c86e557cc59bB575A420B69aFdF41EA873b1',
    56: '0x',
  },
  transportation: {
    4002: '0xAb9C6F27Bf60B54348D41aDaA04016ED7f545Fff',
    56: '0x',
  },
  healthcare: {
    4002: '0x078aaD24DADD93105e88794E79316d711680eB8a',
    56: '0x',
  },
  food: {
    4002: '0x916a1741323Ab488EB89E1ae1eC22Bd75805D554',
    56: '0x',
  },
  beverage: {
    4002: '0xAD9e033e99EB965dBEDDd2E52C926dDDe5Fa09CC',
    56: '0x',
  },
  'law & order': {
    4002: '0x25747920013905D87B5CF184bD0f87B5eC1D8986',
    56: '0x',
  },
  'software & telco & other': {
    4002: '0xb2a75385638e8D264fd50D26EF3D9c11cAD17A8d',
    56: '0x',
  },
  'apparel, beauty & cosmetics': {
    4002: '0x4280Ea442ddF111c81a151451516bdb9d3f78B2A',
    56: '0x',
  },
  energy: {
    4002: '0x00B0f1165Ff308059C80A4FB31572D307E797230',
    56: '0x',
  },
  mining: {
    4002: '0xc4c8fd6E3A451D490a242Fb097Fa81EC6d01139C',
    56: '0x',
  },
  'culture & entertainment': {
    4002: '0x67BA3f68a1F99a941A6DcA76eAB938f9E3E5A70A',
    56: '0x',
  },
  nsfw: {
    4002: '0xEbc5A777650B93dE9DF706139ee1e7e7E3CD0F26',
    56: '0x',
  },
  FRET: {
    4002: '0x5Ecc7dc2987729bcf7E0Fc749e70F518BBB3Aa56',
    56: '0x',
  },
  FTT: {
    4002: '0x47D74c85fce4c5A484467020Ae0C2c5A63620680',
    56: '0x',
  },
  FHT: {
    4002: '0x798d7ec0058654320F2513Ef7f5ca9688e398A4e',
    56: '0x',
  },
  FFT: {
    4002: '0x11D38bDe61af6baA177198b6C35de1E573782b4C',
    56: '0x',
  },
  FBT: {
    4002: '0x140eb5e979796bc233e129ED1Dc8A9AFE7F18dAA',
    56: '0x',
  },
  FLOT: {
    4002: '0xD2BC877C4ad694C05Cd1e9CB05F3941e8A749Ad6',
    56: '0x',
  },
  FSTT: {
    4002: '0xA151e4494e7a0519178663d956cD1c54Fa11e7B5',
    56: '0x',
  },
  FABT: {
    4002: '0x61717A9427a47c959C796B7E9ef96B118380D0B2',
    56: '0x',
  },
  FET: {
    4002: '0x9820779cD8eDb1fC82B3B360CFC0221A7F65e768',
    56: '0x',
  },
  FMT: {
    4002: '0xAD77753F29dc30F17Dc61Bb24e68A3db86D2c9A9',
    56: '0x',
  },
  FECT: {
    4002: '0x031B80f0e15b321A52c722F128Fe389A09e96194',
    56: '0x',
  },
  FNT: {
    4002: '0x0a7597014ADbd0CE1C275b511E706559A5f1F07e',
    56: '0x',
  },
} as const satisfies Record<string, Record<number, `0x${string}`>>
// 0x6e0521b964Aafe1A50159C003f4876275E6C7c9a
