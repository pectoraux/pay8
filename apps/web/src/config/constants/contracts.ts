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
    4002: '0x7163C18B91b99008931499b5F3990Db2dB71aa9b',
  },
  rampHelper2: {
    56: '0x',
    4002: '0xA7D1c88d50B5f31cECf724be1306397e4E0B876d',
  },
  rampFactory: {
    56: '0x',
    4002: '0xF9Eb83D872356d58a57630039E3Cec932F3f5f51',
  },
  rampAds: {
    56: '0x',
    4002: '0x93570729A733736FD06D511cD0A878e11c0856B2',
  },
  extraTokenFactory: {
    56: '0x',
    4002: '0x87EDbF47a1e2373282c34298F4041c0c80e328E8',
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
    4002: '0xA80005eE4763d24D5bBd800B1E65D87508157C71',
  },
  ARPHelper: {
    56: '0x',
    4002: '0xc96696332D29fecb302BECD1B4e32eada684F3FA',
  },
  ARPMinter: {
    56: '0x',
    4002: '0x366e179794a12041E95AbdEFA5a1dCfAe8E9Bb20',
  },
  ARPFactory: {
    56: '0x',
    4002: '0xC6B2e9ea0864a3A3171D2c303ed834471c82D1eb',
  },
  BILLNote: {
    56: '0x',
    4002: '0x25702f0130bB427e7bcb2722D3C05729D7b3D6Ce',
  },
  BILLHelper: {
    56: '0x',
    4002: '0x5FFaB566e027492997f6A3e9A4CA1D7bcA63E315',
  },
  BILLMinter: {
    56: '0x',
    4002: '0xB86179Ca4a75c5430d62280c319508B9F1Fc8642',
  },
  BILLFactory: {
    56: '0x',
    4002: '0x1CCc9309F72ca90b63071f64b053214a4953960a',
  },
  lottery: {
    56: '0x',
    4002: '0xa0a200D83C67fBa6386a8c901eB43CD6013104af',
  },
  lotteryHelper: {
    56: '0x',
    4002: '0x49BA1bE93992a0fD9FE475B9bdF6b6D97C685e1C',
  },
  lotteryRandomNumberGenerator: {
    56: '0x',
    4002: '0x64e7a26A476A4D832F4ED5393a43a4e0c2D852Ce',
  },
  randomNumberGenerator: {
    56: '0x',
    4002: '0x131637F4d7B58d7061Ec00ceFAA4DBF66B968921',
  },
  gameFactory: {
    56: '0x',
    4002: '0xe1624A26c6faC1db81c26E9B6AED4Ce86057f6C2',
  },
  gameMinter: {
    56: '0x',
    4002: '0xF05d6037027e45C76aC339114e8cF7C07851641F',
  },
  gameHelper: {
    56: '0x',
    4002: '0x1B3a841Bfc8F7726E47BCfe17CDcA2Ed13662A80',
  },
  gameHelper2: {
    56: '0x',
    4002: '0x6501C1dd23b4F9B1B6311A94D48f810Ba53CA22C',
  },
  paywallARPHelper: {
    56: '0x',
    4002: '0xDA1f5994a7568A6F7dED60E34fD29fAc5f466C23',
  },
  paywallARPFactory: {
    56: '0x',
    4002: '0xD306Bc71120c7Ca5cd5Ce19Bc57f005Bf4F6D264',
  },
  minterFactory: {
    4002: '0x972A806DD4C5536E50F38155d7AfFD04741429a0',
    56: '0x',
  },
  nfticket: {
    4002: '0xC4bdaB8341803547Bc8d468ef7Ee7e7B35953c89',
    56: '0x',
  },
  nfticketHelper: {
    4002: '0x8e29bd8dd5c1D62594d6826C0660312E4191593B',
    56: '0x',
  },
  nfticketHelper2: {
    4002: '0xEE4a5abf0fC0978b2DCf7c2bc8d57FDc43DadB55',
    56: '0x',
  },
  marketEvents: {
    4002: '0xB891F70205643D7DC4e6c6891013E92183E43AB1',
    56: '0x',
  },
  marketCollections: {
    4002: '0x2265a1377833F7BCCDbC5729Ba832552B48A7c92',
    56: '0x0000000000000000000000000000000000000000',
  },
  marketOrders: {
    4002: '0x3DFB090975C08535462b7BB49cd2c5c3e7Eeb49E',
    56: '0x',
  },
  marketTrades: {
    4002: '0xA19fb0df53D03D88d9786B8091070D0cCbD17ADC',
    56: '0x',
  },
  marketHelper: {
    4002: '0x99dbF90228302E17B0CcFaa541DCE676775A8EBA',
    56: '0x',
  },
  marketHelper2: {
    4002: '0xeDA992166cd47e84Af047d6d355ACD841307c91f',
    56: '0x',
  },
  marketHelper3: {
    4002: '0x8a61AB91ec0e1aD414c5F90D072ea8276496B167',
    56: '0x',
  },
  nftMarketOrders: {
    4002: '0x8F0dE71645c5fc6dE40A0b5066d0e53BeCC3bCf5',
    56: '0x',
  },
  nftMarketTrades: {
    4002: '0x4C15181252952064399D593a3B868521A2Fd0425',
    56: '0x',
  },
  nftMarketHelper: {
    4002: '0x9BbA15a01A3bc11A6aD200B3de333fB26930737F',
    56: '0x',
  },
  nftMarketHelper2: {
    4002: '0xD5C57208CD6b89c540010727D7ac1647255Ed0e3',
    56: '0x',
  },
  nftMarketHelper3: {
    4002: '0x63166f4fC06260416031A583f14E3d28BA8d76f9',
    56: '0x',
  },
  paywallMarketOrders: {
    4002: '0x8127516Ff3c8fE6fdb9CE22145C6BFDb83aB54c6',
    56: '0x',
  },
  paywallMarketTrades: {
    4002: '0x72925EE40442597c02bfAa3295113E7BD1479c45',
    56: '0x',
  },
  paywallMarketHelper: {
    4002: '0x2f01f949F9cDE9822dF361A85bBe5A0BDCb659d3',
    56: '0x',
  },
  paywallMarketHelper2: {
    4002: '0x6444FeDeD64cb196253E31527647fb5075b3F722',
    56: '0x',
  },
  paywallMarketHelper3: {
    4002: '0x442e00e70e71325d400F21B58eaA7b98496A237e',
    56: '0x',
  },
  stakemarket: {
    4002: '0xbf877500681AF64f10F6C3E92fA9946f800804ea',
    56: '0x',
  },
  stakemarketNote: {
    4002: '0x2596c9eA9473AE8B1F8EB08019CD8e9844Cea34a',
    56: '0x',
  },
  stakemarketHelper: {
    4002: '0xf178d8A6661aBA43bEaFe98080e47CD213c2FC34',
    56: '0x',
  },
  stakemarketVoter: {
    4002: '0xeAf2c655581C83D47497D9D0C68dE09b1B32Fa55',
    56: '0x',
  },
  stakemarketBribe: {
    4002: '0x1b947A45Ad79438d5F47f45C920B9f1Dbe26f802',
    56: '0x',
  },
  bettingHelper: {
    4002: '0xD1a149c8eF80c41927b80756D1b7E9dB56d26e1F',
    56: '0x',
  },
  bettingMinter: {
    4002: '0x2A9768883eB091E2c1fdDB8Bf4D9d243FF487D6A',
    56: '0x',
  },
  bettingFactory: {
    4002: '0xaF9BC1531331d538428bf951a8B4DFCE3CF8C41c',
    56: '0x',
  },
  trustbounties: {
    4002: '0x99fAc8AB3f51C89AC45372d0dfDB63d979f0d5EB',
    56: '0x',
  },
  trustbountiesHelper: {
    4002: '0xcB2863E4aEd438AF8973cf28480315ba0EF3BFf2',
    56: '0x',
  },
  trustbountiesvoter: {
    4002: '0x2CD8f718BD6784873454d6288119d51DfcAe6FA4',
    56: '0x',
  },
  invoiceFactory: {
    4002: '0xC9F542F4A38349048FAE742d3C4136E69df23d77',
    56: '0x',
  },
  valuepoolVoter: {
    4002: '0x3a5231DAC8755102D17b911c0Dc99cE7DC47d0bD',
    56: '0x',
  },
  vaFactory: {
    4002: '0x60496E81e744B5aD59b91d17Cfa62036d69fC856',
    56: '0x',
  },
  valuepoolFactory: {
    4002: '0x5fdbCeEc25E02d15dE51af3450289c72Ef2d081E',
    56: '0x',
  },
  valuepoolHelper: {
    4002: '0xC38993A66820830bfED5D92bc4c937a4bba4528D',
    56: '0x',
  },
  valuepoolHelper2: {
    4002: '0x282E20b214ec4f4ae560dB9eaF03a29D0910Cb40',
    56: '0x',
  },
  businessVoter: {
    4002: '0x6D4cd0706C6412C6a92777e20815A77EfC8d45F7',
    56: '0x',
  },
  businessMinter: {
    4002: '0xfF4d74eD76bBF5b6Da80F3b5D493d3f23D52eB55',
    56: '0x',
  },
  businessBribeFactory: {
    4002: '0x66290cB912Ea1E7cFF9eC48FD9E3CE9874a2C67d',
    56: '0x',
  },
  businessGaugeFactory: {
    4002: '0x3a5F4F01Bbe5729b8EC35f453d4a92A364F9eF66',
    56: '0x',
  },
  referralBribeFactory: {
    4002: '0xc2Bdff16fa13bBffFEB42602cC15d2a514a413eD',
    56: '0x',
  },
  referralVoter: {
    4002: '0xe1BCA805F16BCCC89de5fbC4D2488C59669F1EaF',
    56: '0x',
  },
  contractAddress: {
    4002: '0x214Cb0c088D0992d5ba36Cff283CB1333149E1e7',
    56: '0x',
  },
  acceleratorVoter: {
    4002: '0x6Bb35f1c6eF8b63831C3A3eDE905B44c90bf032E',
    56: '0x',
  },
  contributorsVoter: {
    4002: '0x03154B4bC5d9B07CAC29ce878Af9df419523C296',
    56: '0x',
  },
  affiliatesVoter: {
    4002: '0x95f203aE002cA6b147dD9F4C9234ad59eF5f8E9B',
    56: '0x',
  },
  auditorNote: {
    4002: '0xdaF12B05685d5A4D8449e54939F6F9E8f19D4A4f',
    56: '0x',
  },
  auditorHelper: {
    4002: '0xD3855fD1b3f467cb7ED91caA037D4f7b6529698b',
    56: '0x',
  },
  auditorHelper2: {
    4002: '0x8c2479569146d74058A997b7Ed16CA74c9578920',
    56: '0x',
  },
  auditorFactory: {
    4002: '0x13eE93a80Fe5B9934a3C079a52Dd36566FAD3061',
    56: '0x',
  },
  sponsorHelper: {
    4002: '0x16bc1C7285bB312b8023ca4879F32d57bB706343',
    56: '0x',
  },
  sponsorFactory: {
    4002: '0xA23Aea1EE6835DD000d8279d5f49212869ddD863',
    56: '0x',
  },
  plusCodes: {
    4002: '0x4F9EdF8a6DcF24b0AB7DBCe59F2AAcE3B23e4e71',
    56: '0x',
  },
  willNote: {
    4002: '0x1F19f653c6fAEEE290a33d229aa63Ebdc950fE7D',
    56: '0x',
  },
  willFactory: {
    4002: '0x586adF5F95Ff0A51fbf1135Bd48D93A4C9872600',
    56: '0x',
  },
  worldFactory: {
    4002: '0x467343544e7e460Fd5DFC0886e9af7401A197AD8',
    56: '0x',
  },
  worldNote: {
    4002: '0x07871934840555b530E31Ed216b5f1028775710b',
    56: '0x',
  },
  worldHelper: {
    4002: '0x28Af881b53072D2312880360Cf2FecA55a6479a0',
    56: '0x',
  },
  worldHelper2: {
    4002: '0xA61c35824d47c9603aD53127E05172463ADc8A4e',
    56: '0x',
  },
  worldHelper3: {
    4002: '0x7619CA8504f960261CB3f60eC077b753Dfdcd61E',
    56: '0x',
  },
  ssi: {
    56: '0x',
    4002: '0x1de9D006f209E9A7556270cae74D1F0D6864168a',
  },
  card: {
    56: '0x',
    4002: '0x5133ce668Dcfe85690CCB890e175F594fb11d0D0',
  },
  futureCollaterals: {
    56: '0x',
    4002: '0xD2b2435aa749E42F3523033Fe167Ae543082375F',
  },
  profile: {
    56: '0x',
    4002: '0x3E0240b8aa46207d267225136BE0837841e53EB5',
  },
  profileHelper: {
    56: '0x',
    4002: '0x2844bAf1253669Bf37fE6480805D95d6BFB5B126',
  },
  nftSVG: {
    56: '0x',
    4002: '0xabd6aB0c520848770B16f2b7d1d3cD58F83f82D8',
  },
  'real estate': {
    4002: '0xb9858E52175Dc194686E29875570703B5C986Fe3', // '0x0515c86e557cc59bB575A420B69aFdF41EA873b1',
    56: '0x',
  },
  transportation: {
    4002: '0x4E53C05E933CE8281CfaBe75b456528d40fcBAFc',
    56: '0x',
  },
  healthcare: {
    4002: '0xdE46100D142FD66f50697dF99c296796100983de',
    56: '0x',
  },
  food: {
    4002: '0x2cc1F3A5A27ef2985768ff98526337db6E05C847',
    56: '0x',
  },
  beverage: {
    4002: '0xdC94F841AedDe3Bb8fD311a61c2b4Fe40a47393d',
    56: '0x',
  },
  'law & order': {
    4002: '0x06BF8AF06Bf883D8124EF7466ABc68Dd8036a5C6',
    56: '0x',
  },
  'software & telco & other': {
    4002: '0x6f491e004Df2e5797F9355F89E4fa4Ae6592e89f',
    56: '0x',
  },
  'apparel, beauty & cosmetics': {
    4002: '0xC853D1c9B60962a5CDB361379595BC6400aaE722',
    56: '0x',
  },
  energy: {
    4002: '0xae6a2d4DbA638766bD3b522cD397cA90F173fDd2',
    56: '0x',
  },
  mining: {
    4002: '0x86130B7eec5561706Ac18877D19ee7D1A584E807',
    56: '0x',
  },
  'culture & entertainment': {
    4002: '0xb55A821877d473D972B4ECBB18E41739687c539f',
    56: '0x',
  },
  nsfw: {
    4002: '0x1a8e20B265A9D5D1Cd3BA0b157da15d5EfB8Ea62',
    56: '0x',
  },
  FRET: {
    4002: '0x6E91468E9685bF6Ddd9Ef0a7Cce5597698878E9D',
    56: '0x',
  },
  FTT: {
    4002: '0x023803056E3532348E8a6Deac35dafD4732F792b',
    56: '0x',
  },
  FHT: {
    4002: '0x272D5d2E5Be74ec1216162D3418be7EDF929d2a9',
    56: '0x',
  },
  FFT: {
    4002: '0x7D797d2D96EA6187E85008B8B2F386a552C86d6b',
    56: '0x',
  },
  FBT: {
    4002: '0x77B0e504900997eE937c0C10E027236aeCD386EF',
    56: '0x',
  },
  FLOT: {
    4002: '0x05Da08335F8B187769E60F3D92254e69ed5dF3EE',
    56: '0x',
  },
  FSTT: {
    4002: '0x59013988E3730A66A9A973a812fb94056E6e7855',
    56: '0x',
  },
  FABT: {
    4002: '0xd17C814f5609889609720D95e1A7369f9F798aB4',
    56: '0x',
  },
  FET: {
    4002: '0xd1a7aB1a1E1aaDD5CD51F51570885c7896bb3139',
    56: '0x',
  },
  FMT: {
    4002: '0xBa9fCa9130BF46FbB09740A3b02d5Ce9deB6ae11',
    56: '0x',
  },
  FECT: {
    4002: '0x406BD6A54A4807E207823D28AB908b0E9466678E',
    56: '0x',
  },
  FNT: {
    4002: '0x7F52Da327C3a6bbFc1dF348994919a66dcAC33e0',
    56: '0x',
  },
} as const satisfies Record<string, Record<number, `0x${string}`>>
// 0x6e0521b964Aafe1A50159C003f4876275E6C7c9a
