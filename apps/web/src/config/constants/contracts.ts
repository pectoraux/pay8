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
    4002: '0x9BEC19D775a197fDc8A0249c612c95B06b449945',
  },
  rampHelper2: {
    56: '0x',
    4002: '0xB845Bd32afF5d57Bf7CD6F4b672704f27929Bf8B',
  },
  rampFactory: {
    56: '0x',
    4002: '0xdC6fAb469dcF7D94fdf525e4DED83FC5C717B059',
  },
  rampAds: {
    56: '0x',
    4002: '0xB69C2F1ceB9e8eCa8B40cD0935E3160ecb065EC5',
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
    4002: '0x8974C04961068F97488E1f117529681FE710D807',
  },
  ARPNote: {
    56: '0x',
    4002: '0xB3cF79b24D751c5FD31a177fdaB449F3f8D8605e',
  },
  ARPHelper: {
    56: '0x',
    4002: '0x854059066aD7BDF6d18E069bdC6b2DE477Ba8949',
  },
  ARPMinter: {
    56: '0x',
    4002: '0x1996caA9a6CDe7CE28D0690B2C0dC37Fd77b6447',
  },
  ARPFactory: {
    56: '0x',
    4002: '0xbfD75c6C25B6045e24a5C446dE04A70c99C76f70',
  },
  BILLNote: {
    56: '0x',
    4002: '0xFf3254b1e3980fDA97FD7a4A245dC43FE8B9E53f',
  },
  BILLHelper: {
    56: '0x',
    4002: '0x995a88e7120fC55a23E82adbdc50a14efA67A2dC',
  },
  BILLMinter: {
    56: '0x',
    4002: '0x39d546Ce9737f5B377b703C4fE5Dc621D162540b',
  },
  BILLFactory: {
    56: '0x',
    4002: '0xB061A49504aa7b6DF228E556954bD58A4Cad3574',
  },
  lotteryHelper: {
    56: '0x',
    4002: '0x3b5d16e362b01Bf8590fF6e82C906F75112130b4',
  },
  lottery: {
    56: '0x',
    4002: '0x0e00e32B2645DBa98B6Cf283B90e7816e1fAF68C',
  },
  randomNumberGenerator: {
    56: '0x',
    4002: '0x131637F4d7B58d7061Ec00ceFAA4DBF66B968921',
  },
  lotteryRandomNumberGenerator: {
    56: '0x',
    4002: '0x08d6D5DA5e45F6a6516F0029b9317e5405A97D62',
  },
  gameHelper: {
    56: '0x',
    4002: '0xa34575aE05aA528A26C5e1Ebb3c8F96fdE3A4657',
  },
  gameHelper2: {
    56: '0x',
    4002: '0x1c814fa2129baD4F90100E929f040eb179f46750',
  },
  gameMinter: {
    56: '0x',
    4002: '0x3643943A1BfD900758619b9bd81a43E4AbCCa933',
  },
  gameFactory: {
    56: '0x',
    4002: '0xE3ce3775A4316e8321130C6a60fE9bB02c34c93D',
  },
  paywallARPHelper: {
    56: '0x',
    4002: '0xC14F82dC05cb692C2F082eeE95C53fDd3765D65A',
  },
  paywallARPFactory: {
    56: '0x',
    4002: '0xc1a0b48e056b136C6567D4e3A543FFDf250f9c66',
  },
  minterFactory: {
    4002: '0xDD4ef326a423226a01533081b6aAa0c0cAf07594',
    56: '0x',
  },
  marketEvents: {
    4002: '0x5DbA44D1074bff70A979D7954003ADC2462197b6',
    56: '0x',
  },
  marketCollections: {
    4002: '0x5eda65Bc02607d7f91abC44bBfdA492706D6de85',
    56: '0x0000000000000000000000000000000000000000',
  },
  marketOrders: {
    4002: '0xda79E66AA64c7b7EC93Ae9adE91560AAb47C70Ae',
    56: '0x',
  },
  marketTrades: {
    4002: '0x2CFA9faDfc967542902F4D6fC313a24da99f20a2',
    56: '0x',
  },
  marketHelper: {
    4002: '0xDE123977f3E7d0f78e77345c5D5B67EC76A0e120',
    56: '0x',
  },
  marketHelper2: {
    4002: '0x338A9C97bab016fd7350754fFFcB929FD9c7A3dB',
    56: '0x',
  },
  marketHelper3: {
    4002: '0xF3b10866e35B054f2F65bBA7913d7f1fD39E120A',
    56: '0x',
  },
  nftMarketOrders: {
    4002: '0x0Be3eA43561241a45109Dc5C3F5f76E73bA558aC',
    56: '0x',
  },
  nftMarketTrades: {
    4002: '0xAeaCE2a9376aAf4066EeE36B1D84F89947c4639C',
    56: '0x',
  },
  nftMarketHelper: {
    4002: '0xd125796BE0B69E0930845089104dD1D2E4c28fac',
    56: '0x',
  },
  nftMarketHelper2: {
    4002: '0x81b3c903cFdFDe5f4c72264c637A489478e8Eee0',
    56: '0x',
  },
  nftMarketHelper3: {
    4002: '0x65E680424C927799973663f5fA150248972be7AB',
    56: '0x',
  },
  paywallMarketOrders: {
    4002: '0x5c172aaB7733D9C731B8789292688F03e0DB4e1C',
    56: '0x',
  },
  paywallMarketTrades: {
    4002: '0xd6D268BceC68ff3CD1E4c42fac07ED9414f25D63',
    56: '0x',
  },
  paywallMarketHelper: {
    4002: '0x009fB63770DaD06c249f6B7cffd8501C434Cc049',
    56: '0x',
  },
  paywallMarketHelper2: {
    4002: '0x6a1eAabB19131a63fDa4A9FCa70e805e969D4A2E',
    56: '0x',
  },
  paywallMarketHelper3: {
    4002: '0x62FaB271Dc341674939DD8Bc5A30a4b54deAe8A9',
    56: '0x',
  },
  nfticket: {
    4002: '0x4bcb5d69694F8968c3D7c534C9DebeE799579Fea',
    56: '0x',
  },
  nfticketHelper: {
    4002: '0x8fd2039895CE73a19a01C8F2c235ED87e3665483',
    56: '0x',
  },
  nfticketHelper2: {
    4002: '0xe3ed414D44f5eC44e20e5b285185122DAe75CC99',
    56: '0x',
  },
  stakemarket: {
    4002: '0xe11515741E0048914Fccb80a2C700d41b757F60A',
    56: '0x',
  },
  stakemarketVoter: {
    4002: '0x9E41eB6e4082643E6Aa50bD3126D38798644e261',
    56: '0x',
  },

  stakemarketNote: {
    4002: '0x1697d2E8c40c3f7c437934fce8FcC37f18B88cdd',
    56: '0x',
  },
  stakemarketHelper: {
    4002: '0x4aFde7B1E5Eb048fdd7dA0253F1461fB59Fb2D1C',
    56: '0x',
  },
  stakemarketBribe: {
    4002: '0xa4Cd94FA5d590f8B8cA844C6B7FFD347c5443Ce4',
    56: '0x',
  },
  bettingHelper: {
    4002: '0xE973F5705566Dd65a3032c16E1DC3Cb52DC8d753',
    56: '0x',
  },
  bettingMinter: {
    4002: '0xA322F9253FF045db7DF5cA058A7e544f7Ad514df',
    56: '0x',
  },
  bettingFactory: {
    4002: '0x8F3f0F4466f67040D436Fe24C24101b2a62b1B6B',
    56: '0x',
  },
  trustbounties: {
    4002: '0xb93E4F7ea004A644a5521E5877B5d5ba851Bb45f',
    56: '0x',
  },
  trustbountiesHelper: {
    4002: '0x1AA7C08cfA80Ef06Ac5bB3F4b6Ea6D6bCC8Ce8b5',
    56: '0x',
  },
  trustbountiesvoter: {
    4002: '0xf94e32A706470af60a752C2167444D5218B1cF77',
    56: '0x',
  },
  arpFactory: {
    4002: '0x0b1119f76589A08530058549aFD1E85445048f56',
    56: '0x',
  },
  invoiceFactory: {
    4002: '0xC9F542F4A38349048FAE742d3C4136E69df23d77',
    56: '0x',
  },
  valuepoolVoter: {
    4002: '0x7c6b04D94232FB98b44F4C91EBe7b3AaE60fe55D',
    56: '0x',
  },
  vaFactory: {
    4002: '0x1fb4E32FDA61810D159afD6B637167670949c94B',
    56: '0x',
  },
  valuepoolFactory: {
    4002: '0x300C09Bf6f68D52Bf633df75E681d5f27e4f8002',
    56: '0x',
  },
  valuepoolHelper: {
    4002: '0xB006b694E29Ab31c8892774725d5e7fd0079328B',
    56: '0x',
  },
  valuepoolHelper2: {
    4002: '0x776B2cE7C144e3958a50FFE084C587038d0E7e90',
    56: '0x',
  },
  businessVoter: {
    4002: '0x3Fd9F56dE77002e267104d106A92967cd000EEC9',
    56: '0x',
  },
  businessMinter: {
    4002: '0xfF4d74eD76bBF5b6Da80F3b5D493d3f23D52eB55',
    56: '0x',
  },
  businessBribeFactory: {
    4002: '0xee1388EeFb6F9206836eB6C64F12bFBAEa14d9Cd',
    56: '0x',
  },
  businessGaugeFactory: {
    4002: '0x3a5F4F01Bbe5729b8EC35f453d4a92A364F9eF66',
    56: '0x',
  },
  referralBribeFactory: {
    4002: '0x3D262AD24C4ff3F8598367a23bA5288Df3581da2',
    56: '0x',
  },
  referralVoter: {
    4002: '0xF72AEF17B06C69d1c2329e8966B7821875BCd21E',
    56: '0x',
  },
  contractAddress: {
    4002: '0x214Cb0c088D0992d5ba36Cff283CB1333149E1e7',
    56: '0x',
  },
  acceleratorVoter: {
    4002: '0x84779D6bCf31E90DE81Ac4155EFA9A725a60B7f9',
    56: '0x',
  },
  contributorsVoter: {
    4002: '0xBCb2E030953dC9f2E68C179C19C2C121aF348Abb',
    56: '0x',
  },
  affiliatesVoter: {
    4002: '0x95f203aE002cA6b147dD9F4C9234ad59eF5f8E9B',
    56: '0x',
  },
  auditorHelper: {
    4002: '0xEE0A3DE3952B71cfadaA155182878Ed49a6D93a2',
    56: '0x',
  },
  auditorHelper2: {
    4002: '0x0e5d8abf5F9A31b8A17e0f35dd89cCcDd1227DC8',
    56: '0x',
  },
  auditorNote: {
    4002: '0x51ccF98593809607bdB08509e8b8d670658f86C0',
    56: '0x',
  },
  auditorFactory: {
    4002: '0xa78F0762FAFd64B90B2F8fb52A8aF923cD399ddD',
    56: '0x',
  },
  sponsorHelper: {
    4002: '0xDF1Fd12D700110CF763A540e059349ce4a453C5A',
    56: '0x',
  },
  sponsorFactory: {
    4002: '0x71324803103f17D00e2E2Fe6449f27d301693c0A',
    56: '0x',
  },
  plusCodes: {
    4002: '0x4F9EdF8a6DcF24b0AB7DBCe59F2AAcE3B23e4e71',
    56: '0x',
  },
  willNote: {
    4002: '0x86EB24C62635573f0dbc52B1b07660f6B3FA8fdA',
    56: '0x',
  },
  willFactory: {
    4002: '0x43CeAaa09f54cCd58B29904BAC64dDe058FcBE87',
    56: '0x',
  },
  worldNote: {
    4002: '0xfC28F508032e3D18e3130791F0b376Bd99aB1374',
    56: '0x',
  },
  worldHelper: {
    4002: '0x0691B361313da730d1528f3100fD4ab7d95370B3',
    56: '0x',
  },
  worldHelper2: {
    4002: '0x350aB48Ad25003D1887a17D269f947f7DD27a2C8',
    56: '0x',
  },
  worldHelper3: {
    4002: '0x29cF710FA955E4F3A6e8E672d4885fd9A43F380F',
    56: '0x',
  },
  worldFactory: {
    4002: '0x0Bb7F9c3dDb587A8843D92f2De22B936c0537545',
    56: '0x',
  },
  ssi: {
    56: '0x',
    4002: '0x1de9D006f209E9A7556270cae74D1F0D6864168a',
  },
  card: {
    56: '0x',
    4002: '0x9899019bb90D216d1DD2Db790daf2dB7dFb6D827',
  },
  futureCollaterals: {
    56: '0x',
    4002: '0xD2b2435aa749E42F3523033Fe167Ae543082375F',
  },
  profile: {
    56: '0x',
    4002: '0x810EBEa7d4330B6A6EFa2f73FF7E7773c57F98CD',
  },
  profileHelper: {
    56: '0x',
    4002: '0xf2Ca8333888cf3C673E81225228a000F9b7b4338',
  },
  mobility: {
    4002: '0xe12e51A9007abA2575B7e4227f2520Fb1E9EDf74',
    56: '0x',
  },
  delivery: {
    4002: '0xfd045C059AC6423F9B21A456a432Ead97a93F706',
    56: '0x',
  },
} as const satisfies Record<string, Record<number, `0x${string}`>>
