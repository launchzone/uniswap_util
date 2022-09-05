/*eslint-disable max-len*/

'use strict'

const assert = require('assert')
const {getPoolAddress, calculatePoolAddress} = require('../')
const {heximalToBuffer} = require('./_lib')

const PANCAKESWAP_FACTORY_ADDRESS_V1 = '0xbcfccbde45ce874adcb698cc183debcf17952812'
const PANCAKESWAP_FACTORY_CODE_V1 = '0xd0d4c4cd0848c93cb4fd1f498d7013ee6bfb25783ea21593d5834f5d250ece66'
const PANCAKESWAP_FACTORY_ADDRESS_V2 = '0xca143ce32fe78f1f7019d7d551a6402fc5350c73'
const PANCAKESWAP_FACTORY_CODE_V2 = '0x00fb7f630766e6a796048ea87d01acd3068e8ff67d078148a3fa3f4a84f69bd5'
const BURGERSWAP_FACTORY_ADDRESS = '0x8a1e9d3aebbbd5ba2a64d3355a48dd5e9b511256'
const BURGERSWAP_FACTORY_CODE = '0x9e2f28ebeccb25f4ead99c3f563bb6a201e2014a501d90dd0a9382bb1f5f4d0e'
const JULSWAP_FACTORY_ADDRESS = '0x553990f2cba90272390f62c5bdb1681ffc899675'
const JULSWAP_FACTORY_CODE = '0xb1e98e21a5335633815a8cfb3b580071c2e4561c50afd57a8746def9ed890b18'
const APESWAP_FACTORY_ADDRESS = '0x0841bd0b734e4f5853f0dd8d7ea041c241fb0da6'
const APESWAP_FACTORY_CODE = '0xf4ccce374816856d11f00e4069e7cada164065686fbef53c6167a63ec2fd8c5b'
const BAKERYSWAP_FACTORY_ADDRESS = '0x01bf7c66c6bd861915cdaae475042d3c4bae16a7'
const BAKERYSWAP_FACTORY_CODE = '0xe2e87433120e32c4738a7d8f3271f3d872cbe16241d67537139158d90bac61d3'
const BI_FACTORY_ADDRESS = '0x858e3312ed3a876947ea49d572a7c42de08af7ee'
const BI_FACTORY_INIT_CODE = '0xfea293c909d87cd4153593f077b76bb7e94340200f4ee84211ae8e4f9bd7ffdf'
const MDEX_FACTORY_ADDRESS = '0x3CD1C46068dAEa5Ebb0d3f55F6915B10648062B8'
const MDEX_FACTORY_INIT_CODE = '0x0d994d996174b05cfc7bed897dc1b20b4c458fc8d64fe98bc78b3c64a6b4d093'
const CAFE_FACTORY_ADDRESS = '0x3e708fdbe3ada63fc94f8f61811196f1302137ad'
const CAFE_FACTORY_INIT_CODE = '0x90bcdb5d0bf0e8db3852b0b7d7e05cc8f7c6eb6d511213c5ba02d1d1dbeda8d3'
const JET_FACTORY_ADDRESS = '0x0eb58E5c8aA63314ff5547289185cC4583DfCBD5'
const JET_FACTORY_INIT_CODE = '0x3125d0a15fa7af49ce234ba1cf5f931bad0504242e0e1ee9fcd7d1d7aa88c651'
const BABY_FACTORY_ADDRESS = '0x86407bea2078ea5f5eb5a52b2caa963bc1f889da'
const BABY_FACTORY_INIT_CODE = '0x48c8bec5512d397a5d512fbb7d83d515e7b6d91e9838730bd1aa1b16575da7f5'
const OPENOCEAN_FACTORY_ADDRESS = '0xd76d8c2a7ca0a1609aea0b9b5017b3f7782891bf'
const OPENOCEAN_FACTORY_INIT_CODE = '0xe7da666f616ba3bdb18c6908b22d556a41659bdd652762c246b8d1fa4f7506b4'

describe('getPoolAddress', () => {
    it('Not supported exchange throws error', () => {
        let invalidFactory = 'foo and bar'
        let wbnbAddress = heximalToBuffer('0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c')
        let dotAddress = heximalToBuffer('0x7083609fce4d1d8dc0c979aab8c869ea2c873402')

        assert.throws(
            () => {
                getPoolAddress(invalidFactory, wbnbAddress, dotAddress)
            },
            {
                name: 'Error',
                message: 'invalid exchange name'
            }
        )
    })

    it('First address is not a buffer throws error', () => {
        let invalidAddress = '0x0e09fabb73bd3ade0a17ecc321fd13a19e81cXXX'
        let wbnbAddress = heximalToBuffer('0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c')

        assert.throws(
            () => {
                getPoolAddress('pancake', invalidAddress, wbnbAddress)
            },
            {
                name: 'Error',
                message: 'Invalid buffer ETH addresses'
            }
        )
    })

    it('Second address has non hex symbol throws error', () => {
        let cakeAddress = heximalToBuffer('0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82')
        let invalidAddress = '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc0XXX'

        assert.throws(
            () => {
                getPoolAddress('pancake', cakeAddress, invalidAddress)
            },
            {
                name: 'Error',
                message: 'Invalid buffer ETH addresses'
            }
        )
    })

    it('First address is too long buffer throws error', () => {
        let invalidAddress = heximalToBuffer('0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c00')
        let wbnbAddress = heximalToBuffer('0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c')

        assert.throws(
            () => {
                getPoolAddress('pancake', invalidAddress, wbnbAddress)
            },
            {
                name: 'Error',
                message: 'Invalid buffer ETH addresses'
            }
        )
    })

    it('Second address is too long throw error', () => {
        let wbnbAddress = heximalToBuffer('0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c')
        let invalidAddress = heximalToBuffer('0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c000')

        assert.throws(
            () => {
                getPoolAddress('pancake', wbnbAddress, invalidAddress)
            },
            {
                name: 'Error',
                message: 'Invalid buffer ETH addresses'
            }
        )
    })

    it('First address is too short throw error', () => {
        let invalidAddress = heximalToBuffer('0x12')
        let wbnbAddress = heximalToBuffer('0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c')

        assert.throws(
            () => {
                getPoolAddress('pancake', invalidAddress, wbnbAddress)
            },
            {
                name: 'Error',
                message: 'Invalid buffer ETH addresses'
            }
        )
    })

    it('Second address is too short throw error', () => {
        let wbnbAddress = heximalToBuffer('0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c')
        let invalidAddress = heximalToBuffer('0x34')

        assert.throws(
            () => {
                getPoolAddress('pancake', wbnbAddress, invalidAddress)
            },
            {
                name: 'Error',
                message: 'Invalid buffer ETH addresses'
            }
        )
    })

    it('First address is zero throw error', () => {
        let zeroAddress = heximalToBuffer('0x0000000000000000000000000000000000000000')
        let btcbAddress = heximalToBuffer('0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c')

        assert.throws(
            () => {
                getPoolAddress('pancake', zeroAddress, btcbAddress)
            },
            {
                name: 'Error',
                message: 'Not accepted zero addresses'
            }
        )
    })

    it('Second address is zero throw error', () => {
        let btcbAddress = heximalToBuffer('0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c')
        let zeroAddress = heximalToBuffer('0x0000000000000000000000000000000000000000')

        assert.throws(
            () => {
                getPoolAddress('pancake', btcbAddress, zeroAddress)
            },
            {
                name: 'Error',
                message: 'Not accepted zero addresses'
            }
        )
    })

    it('Addresses are the same throw error', () => {
        let btcbAddress = heximalToBuffer('0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c')

        assert.throws(
            () => {
                getPoolAddress('pancake', btcbAddress, btcbAddress)
            },
            {
                name: 'Error',
                message: 'Not identical addresses'
            }
        )
    })

    it('Pancake exchange', () => {
        let cakeAddress = heximalToBuffer('0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82')
        let wbnbAddress = heximalToBuffer('0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c')
        let expectAddress = heximalToBuffer('0xA527a61703D82139F8a06Bc30097cC9CAA2df5A6')
        let actualAddress = calculatePoolAddress(
            PANCAKESWAP_FACTORY_ADDRESS_V1,
            PANCAKESWAP_FACTORY_CODE_V1,
            cakeAddress,
            wbnbAddress)

        assert.deepStrictEqual(actualAddress, expectAddress)
    })

    it('Pancake V2 exchange', () => {
        let cakeAddress = heximalToBuffer('0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82')
        let wbnbAddress = heximalToBuffer('0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c')
        let expectAddress = heximalToBuffer('0x0eD7e52944161450477ee417DE9Cd3a859b14fD0')
        let actualAddress = calculatePoolAddress(
            PANCAKESWAP_FACTORY_ADDRESS_V2,
            PANCAKESWAP_FACTORY_CODE_V2,
            cakeAddress,
            wbnbAddress)

        assert.deepStrictEqual(actualAddress, expectAddress)
    })

    it('Bakery exchange', () => {
        let wbnbAddress = heximalToBuffer('0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c')
        let clownAddress = heximalToBuffer('0xfa949ef822125233f1e1a0691c13977b4354b257')
        let expectAddress = heximalToBuffer('0x9d311dd545Ae8b39e86ed3733eDfe4D5B7f27e0a')
        let actualAddress = calculatePoolAddress(
            BAKERYSWAP_FACTORY_ADDRESS,
            BAKERYSWAP_FACTORY_CODE,
            wbnbAddress,
            clownAddress)

        assert.deepStrictEqual(actualAddress, expectAddress)
    })

    it('Jul exchange', () => {
        let cakeAddress = heximalToBuffer('0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82')
        let ePycAddress = heximalToBuffer('0x322895d51479e5de68cc3492bf0dea07c549a0e2')
        let expectAddress = heximalToBuffer('0xf17AD5dAd9293523d6D99a14Add6Cec43f943603')
        let actualAddress = calculatePoolAddress(
            JULSWAP_FACTORY_ADDRESS,
            JULSWAP_FACTORY_CODE,
            cakeAddress,
            ePycAddress)

        assert.deepStrictEqual(actualAddress, expectAddress)
    })

    it('Ape exchange', () => {
        let lnxAddress = heximalToBuffer('0xc465503b2f65cc67a070f9afe3f095f2d1e49331')
        let wbnbAddress = heximalToBuffer('0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c')
        let expectAddress = heximalToBuffer('0x878f20766BaE2748eFA77824b8c4f51513aEe3eB')
        let actualAddress = calculatePoolAddress(
            APESWAP_FACTORY_ADDRESS,
            APESWAP_FACTORY_CODE,
            lnxAddress,
            wbnbAddress)

        assert.deepStrictEqual(actualAddress, expectAddress)
    })

    it('Burger exchange', () => {
        let imoAddress = heximalToBuffer('0x6bdd25b0b786ff3e992baa1a2cb6cc41f61d6737')
        let wbnbAddress = heximalToBuffer('0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c')
        let expectAddress = heximalToBuffer('0x24E6212664ff264EaeBb53926811680d1d9e6AC5')
        let actualAddress = calculatePoolAddress(
            BURGERSWAP_FACTORY_ADDRESS,
            BURGERSWAP_FACTORY_CODE,
            imoAddress,
            wbnbAddress)

        assert.deepStrictEqual(actualAddress, expectAddress)
    })

    it('Bi exchange', () => {
        let formAddress = heximalToBuffer('0x25a528af62e56512a19ce8c3cab427807c28cc19')
        let busdAddress = heximalToBuffer('0xe9e7cea3dedca5984780bafc599bd69add087d56')
        let expectAddress = heximalToBuffer('0x43c1e1a0998d9e025d899e71d5199b6f6911add3')
        let actualAddress = calculatePoolAddress(
            BI_FACTORY_ADDRESS,
            BI_FACTORY_INIT_CODE,
            formAddress,
            busdAddress)

        assert.deepStrictEqual(actualAddress, expectAddress)
    })

    it('Mdex exchange', () => {
        let betAddress = heximalToBuffer('0x028a52032a7075a42585c037f069c62b49ebaa3d')
        let busdAddress = heximalToBuffer('0x55d398326f99059ff775485246999027b3197955')
        let expectAddress = heximalToBuffer('0x40050bc7c87a2e1669f8d55f607a145bd54fa4f4')
        let actualAddress = calculatePoolAddress(
            MDEX_FACTORY_ADDRESS,
            MDEX_FACTORY_INIT_CODE,
            betAddress,
            busdAddress)

        assert.deepStrictEqual(actualAddress, expectAddress)
    })

    it('Cafe exchange', () => {
        let usdtAddress = heximalToBuffer('0x23396cf899ca06c4472205fc903bdb4de249d6fc')
        let usdcAddress = heximalToBuffer('0x55d398326f99059ff775485246999027b3197955')
        let expectAddress = heximalToBuffer('0x85d2e6d17162275740e1e630933306ce50967073')
        let actualAddress = calculatePoolAddress(
            CAFE_FACTORY_ADDRESS,
            CAFE_FACTORY_INIT_CODE,
            usdtAddress,
            usdcAddress)

        assert.deepStrictEqual(actualAddress, expectAddress)
    })

    it('Jet exchange', () => {
        let busdAddress = heximalToBuffer('0x55d398326f99059ff775485246999027b3197955')
        let ad2Address = heximalToBuffer('0xc4acd115f1ceebd4a88273423d6cf77c4a1c7559')
        let expectAddress = heximalToBuffer('0xedd292325acd24d045077ffcad2b1020db9bcec1')
        let actualAddress = calculatePoolAddress(
            JET_FACTORY_ADDRESS,
            JET_FACTORY_INIT_CODE,
            busdAddress,
            ad2Address)

        assert.deepStrictEqual(actualAddress, expectAddress)
    })

    it('Baby exchange', () => {
        let cakeAddress = heximalToBuffer('0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82')
        let wbnbAddress = heximalToBuffer('0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c')
        let expectAddress = heximalToBuffer('0x8eea120384ace96a63e2f144ef7f9a6f2bbcff8f')
        let actualAddress = calculatePoolAddress(
            BABY_FACTORY_ADDRESS,
            BABY_FACTORY_INIT_CODE,
            cakeAddress,
            wbnbAddress)

        assert.deepStrictEqual(actualAddress, expectAddress)
    })

    it('Openocean exchange', () => {
        let metapayAddress = heximalToBuffer('0x4c460c84b34a89fb76778a0995b2128e6038c995')
        let busdAddress = heximalToBuffer('0xe9e7cea3dedca5984780bafc599bd69add087d56')
        let expectAddress = heximalToBuffer('0x564e68785fa27e836160ffce201051dce17c5e18')
        let actualAddress = calculatePoolAddress(
            OPENOCEAN_FACTORY_ADDRESS,
            OPENOCEAN_FACTORY_INIT_CODE,
            metapayAddress,
            busdAddress)

        assert.deepStrictEqual(actualAddress, expectAddress)
    })
})
