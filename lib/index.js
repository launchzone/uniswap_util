'use strict'

const {
    keccak256,
    isAddress,
    getAddress
} = require('ethers').utils
const {isEthAddress} = require('./validator')
const {
    toEthAddress,
    toFactoryInitCode
} = require('./formatter')

/*eslint-disable no-unused-vars*/
const {
    EthAddress,
    EthAddressWeak,
    ExchangeName
} = require('./type')
/*eslint-enable no-unused-vars*/

const ADDRESS_ZERO = Buffer.alloc(20, 0)
const HEX_FF = Buffer.from('ff', 'hex')
const PANCAKESWAP_FACTORY_ADDRESS_V1 = toEthAddress(
    '0xbcfccbde45ce874adcb698cc183debcf17952812'
)
const PANCAKESWAP_FACTORY_CODE_V1 = toFactoryInitCode(
    '0xd0d4c4cd0848c93cb4fd1f498d7013ee6bfb25783ea21593d5834f5d250ece66'
)
const PANCAKESWAP_FACTORY_ADDRESS_V2 = toEthAddress(
    '0xca143ce32fe78f1f7019d7d551a6402fc5350c73'
)
const PANCAKESWAP_FACTORY_CODE_V2 = toFactoryInitCode(
    '0x00fb7f630766e6a796048ea87d01acd3068e8ff67d078148a3fa3f4a84f69bd5'
)
const BURGERSWAP_FACTORY_ADDRESS = toEthAddress(
    '0x8a1e9d3aebbbd5ba2a64d3355a48dd5e9b511256'
)
const BURGERSWAP_FACTORY_CODE = toFactoryInitCode(
    '0x9e2f28ebeccb25f4ead99c3f563bb6a201e2014a501d90dd0a9382bb1f5f4d0e'
)
const JULSWAP_FACTORY_ADDRESS = toEthAddress(
    '0x553990f2cba90272390f62c5bdb1681ffc899675'
)
const JULSWAP_FACTORY_CODE = toFactoryInitCode(
    '0xb1e98e21a5335633815a8cfb3b580071c2e4561c50afd57a8746def9ed890b18'
)
const APESWAP_FACTORY_ADDRESS = toEthAddress(
    '0x0841bd0b734e4f5853f0dd8d7ea041c241fb0da6'
)
const APESWAP_FACTORY_CODE = toFactoryInitCode(
    '0xf4ccce374816856d11f00e4069e7cada164065686fbef53c6167a63ec2fd8c5b'
)
const BAKERYSWAP_FACTORY_ADDRESS = toEthAddress(
    '0x01bf7c66c6bd861915cdaae475042d3c4bae16a7'
)
const BAKERYSWAP_FACTORY_CODE = toFactoryInitCode(
    '0xe2e87433120e32c4738a7d8f3271f3d872cbe16241d67537139158d90bac61d3'
)
const BI_FACTORY_ADDRESS = toEthAddress(
    '0x858e3312ed3a876947ea49d572a7c42de08af7ee'
)
const BI_FACTORY_INIT_CODE = toFactoryInitCode(
    '0xfea293c909d87cd4153593f077b76bb7e94340200f4ee84211ae8e4f9bd7ffdf'
)
const MDEX_FACTORY_ADDRESS = toEthAddress(
    '0x3CD1C46068dAEa5Ebb0d3f55F6915B10648062B8'
)
const MDEX_FACTORY_INIT_CODE = toFactoryInitCode(
    '0x0d994d996174b05cfc7bed897dc1b20b4c458fc8d64fe98bc78b3c64a6b4d093'
)
const CAFE_FACTORY_ADDRESS = toEthAddress(
    '0x3e708fdbe3ada63fc94f8f61811196f1302137ad'
)
const CAFE_FACTORY_INIT_CODE = toFactoryInitCode(
    '0x90bcdb5d0bf0e8db3852b0b7d7e05cc8f7c6eb6d511213c5ba02d1d1dbeda8d3'
)
const JET_FACTORY_ADDRESS = toEthAddress(
    '0x0eb58E5c8aA63314ff5547289185cC4583DfCBD5'
)
const JET_FACTORY_INIT_CODE = toFactoryInitCode(
    '0x3125d0a15fa7af49ce234ba1cf5f931bad0504242e0e1ee9fcd7d1d7aa88c651'
)
const BABY_FACTORY_ADDRESS = toEthAddress(
    '0x86407bea2078ea5f5eb5a52b2caa963bc1f889da'
)
const BABY_FACTORY_INIT_CODE = toFactoryInitCode(
    '0x48c8bec5512d397a5d512fbb7d83d515e7b6d91e9838730bd1aa1b16575da7f5'
)
const OPENOCEAN_FACTORY_ADDRESS = toEthAddress(
    '0xd76d8c2a7ca0a1609aea0b9b5017b3f7782891bf'
)
const OPENOCEAN_FACTORY_INIT_CODE = toFactoryInitCode(
    '0xe7da666f616ba3bdb18c6908b22d556a41659bdd652762c246b8d1fa4f7506b4'
)
const EXCHANGE_ADDRESS_MAP = new Map([
    [ExchangeName.PANCAKE, PANCAKESWAP_FACTORY_ADDRESS_V1],
    [ExchangeName.PANCAKE2, PANCAKESWAP_FACTORY_ADDRESS_V2],
    [ExchangeName.BAKERY, BAKERYSWAP_FACTORY_ADDRESS],
    [ExchangeName.JUL, JULSWAP_FACTORY_ADDRESS],
    [ExchangeName.APE, APESWAP_FACTORY_ADDRESS],
    [ExchangeName.BI, BI_FACTORY_ADDRESS],
    [ExchangeName.MDEX, MDEX_FACTORY_ADDRESS],
    [ExchangeName.CAFE, CAFE_FACTORY_ADDRESS],
    [ExchangeName.JET, JET_FACTORY_ADDRESS],
    [ExchangeName.BABY, BABY_FACTORY_ADDRESS],
    [ExchangeName.OPENOCEAN, OPENOCEAN_FACTORY_ADDRESS]
])

/**
 * Build pool address from two token addresses.
 *
 * @param {EthAddress} factory
 * @param {byte32} initCodeHash
 * @param {EthAddress} addressA
 * @param {EthAddress} addressB
 * @returns {EthAddress} Address of the pool.
 * @throws {Error}
 */
 function calculatePoolAddress(factory, initCodeHash, addressA, addressB) {
    return _calculatePoolAddress(factory, initCodeHash, addressA, addressB)
}

/**
 * Build pool address from two token addresses.
 *
 * @param {EthAddress} factory
 * @param {byte32} initCodeHash
 * @param {EthAddress} token0
 * @param {EthAddress} token1
 * @returns {EthAddress} Address of the pool.
 * @throws {Error}
 */
function _calculatePoolAddress(factory, initCodeHash, token0, token1){
    if (!isEthAddress(token0) || !isEthAddress(token1)) {
        throw new Error('Invalid buffer ETH addresses')
    }

    if (
        Buffer.compare(token0, ADDRESS_ZERO) === 0 ||
        Buffer.compare(token1, ADDRESS_ZERO) === 0
    ) {
        throw new Error('Not accepted zero addresses')
    }

    if (Buffer.compare(token0, token1) === 0) {
        throw new Error('Not identical addresses')
    }
    if (!Buffer.isBuffer(factory)) factory = toEthAddress(factory)
    if (!Buffer.isBuffer(initCodeHash)) initCodeHash = toFactoryInitCode(initCodeHash)
    let addresses = _sortAddressPair(token0, token1)
    let salt = _keccak256AsBuffer(
        Buffer.concat(addresses)
    )
    let data = Buffer.concat([
        HEX_FF,
        factory,
        salt,
        initCodeHash
    ])
    let hash = _keccak256AsBuffer(data)

    return hash.slice(12)
}

/**
 * Build pool address from two heximal token addresses.
 *
 * @param {EthAddress} factory
 * @param {byte32} initCodeHash
 * @param {EthAddressWeak} addressA
 * @param {EthAddressWeak} addressB
 * @returns {EthAddress} Address of the pool.
 * @throws {Error}
 */
 function calculatePoolAddressHeximal(factory, initCodeHash, addressA, addressB) {
    let [bufferA, bufferB] = _toAddressPairBuffer(addressA, addressB)
    let address = _calculatePoolAddress(factory, initCodeHash, bufferA, bufferB)

    return getAddress(
        address.toString('hex')
    )
}

/**
 * Build pool address from two token addresses.
 *
 * @param {ExchangeName} exchange
 * @param {EthAddress} addressA
 * @param {EthAddress} addressB
 * @returns {EthAddress} Address of the pool.
 * @throws {Error}
 */
function getPoolAddress(exchange, addressA, addressB) {
    return _getPoolAddress(exchange, addressA, addressB)
}

/**
 * Build pool address from two heximal token addresses.
 *
 * @param {ExchangeName} exchange
 * @param {EthAddressWeak} addressA
 * @param {EthAddressWeak} addressB
 * @returns {EthAddress} Address of the pool.
 * @throws {Error}
 */
function getPoolAddressHeximal(exchange, addressA, addressB) {
    let [bufferA, bufferB] = _toAddressPairBuffer(addressA, addressB)
    let address = _getPoolAddress(exchange, bufferA, bufferB)

    return getAddress(
        address.toString('hex')
    )
}

/**
 *
 * @param {ExchangeName} name - Name of exchange.
 * @return {undefined | string}
 */
function getExchangeAddress(name) {
    return EXCHANGE_ADDRESS_MAP.get(name)
}

/**
 * * Validate addresses.
 * * Convert heximal addresses to standard addresses.
 *
 * @private
 * @param {EthAddressWeak} addressA
 * @param {EthAddressWeak} addressB
 * @returns {Array<EthAddress>}}
 */
function _toAddressPairBuffer(addressA, addressB) {
    if (!isAddress(addressA) || !isAddress(addressB)) {
        throw Error('Invalid ETH address')
    }

    let bufferA = _bufferFromAddress(addressA)
    let bufferB = _bufferFromAddress(addressB)

    return [bufferA, bufferB]
}

/**
 *
 * @private
 * @param {EthAddressWeak} address
 * @returns {EthAddress}
 */
function _bufferFromAddress(address) {
    let prefix = address.substring(0, 2)

    return prefix === '0x'
        ? Buffer.from(address.substring(2), 'hex')
        : Buffer.from(address, 'hex')
}

/**
 * Build pool address from two token addresses.
 *
 * @private
 * @param {ExchangeName} exchange
 * @param {EthAddress} addressA
 * @param {EthAddress} addressB
 * @returns {EthAddress}
 */
function _getPoolAddress(exchange, addressA, addressB) {
    if (!isEthAddress(addressA) || !isEthAddress(addressB)) {
        throw new Error('Invalid buffer ETH addresses')
    }

    if (
        Buffer.compare(addressA, ADDRESS_ZERO) === 0 ||
        Buffer.compare(addressB, ADDRESS_ZERO) === 0
    ) {
        throw new Error('Not accepted zero addresses')
    }

    if (Buffer.compare(addressA, addressB) === 0) {
        throw new Error('Not identical addresses')
    }

    switch (exchange) {
        case 'pancake':
            return _getPoolAddressPancake(addressA, addressB)
        case 'pancake2':
            return _getPoolAddressPancake2(addressA, addressB)
        case 'bakery':
            return _getPoolAddressBakery(addressA, addressB)
        case 'jul':
            return _getPoolAddressJul(addressA, addressB)
        case 'ape':
            return _getPoolAddressApe(addressA, addressB)
        case 'burger':
            return _getPoolAddressBurger(addressA, addressB)
        case 'bi':
            return _getPoolAddressBi(addressA, addressB)
        case 'mdex':
            return _getPoolAddressMdex(addressA, addressB)
        case 'cafe':
            return _getPoolAddressCafe(addressA, addressB)
        case 'jet':
            return _getPoolAddressJet(addressA, addressB)
        case 'baby':
            return _getPoolAddressBaby(addressA, addressB)
        case 'openocean':
            return _getPoolAddressOpenocean(addressA, addressB)
        default:
            throw Error('invalid exchange name')
    }
}

/**
 * Sort two addresses by increasing order.
 *
 * @private
 * @param {EthAddress} addressA
 * @param {EthAddress} addressB
 * @returns {Array<EthAddress>}
 */
function _sortAddressPair(addressA, addressB) {
    return [addressA, addressB].sort((a, b) => a.compare(b))
}

/**
 * Retrieve hash of `data` by Keccak256 algorithm.
 *
 * @private
 * @param {Buffer} data
 * @returns {Buffer}
 */
function _keccak256AsBuffer(data) {
    return Buffer.from(
        keccak256(data).substring(2),
        'hex'
    )
}

/**
 * Build pool address on PancakeSwap.
 *
 * @private
 * @param {EthAddress} addressA
 * @param {EthAddress} addressB
 * @returns {EthAddress}
 */
function _getPoolAddressPancake(addressA, addressB) {
    let addresses = _sortAddressPair(addressA, addressB)
    let salt = _keccak256AsBuffer(
        Buffer.concat(addresses)
    )
    let data = Buffer.concat([
        HEX_FF,
        PANCAKESWAP_FACTORY_ADDRESS_V1,
        salt,
        PANCAKESWAP_FACTORY_CODE_V1
    ])
    let hash = _keccak256AsBuffer(data)

    return hash.slice(12)
}

/**
 * Build pool address on PancakeSwap V2.
 *
 * @private
 * @param {EthAddress} addressA
 * @param {EthAddress} addressB
 * @returns {EthAddress}
 */
function _getPoolAddressPancake2(addressA, addressB) {
    let addresses = _sortAddressPair(addressA, addressB)
    let salt = _keccak256AsBuffer(
        Buffer.concat(addresses)
    )
    let data = Buffer.concat([
        HEX_FF,
        PANCAKESWAP_FACTORY_ADDRESS_V2,
        salt,
        PANCAKESWAP_FACTORY_CODE_V2
    ])
    let hash = _keccak256AsBuffer(data)

    return hash.slice(12)
}

/**
 * Build pool address on BakerySwap.
 *
 * @private
 * @param {EthAddress} addressA
 * @param {EthAddress} addressB
 * @returns {EthAddress}
 */
function _getPoolAddressBakery(addressA, addressB) {
    let addresses = _sortAddressPair(addressA, addressB)
    let salt = _keccak256AsBuffer(
        Buffer.concat(addresses)
    )
    let data = Buffer.concat([
        HEX_FF,
        BAKERYSWAP_FACTORY_ADDRESS,
        salt,
        BAKERYSWAP_FACTORY_CODE
    ])
    let hash = _keccak256AsBuffer(data)

    return hash.slice(12)
}

/**
 * Build pool address on JulSwap.
 *
 * @private
 * @param {EthAddress} addressA
 * @param {EthAddress} addressB
 * @returns {EthAddress}
 */
function _getPoolAddressJul(addressA, addressB) {
    let addresses = _sortAddressPair(addressA, addressB)
    let salt = _keccak256AsBuffer(
        Buffer.concat(addresses)
    )
    let data = Buffer.concat([
        HEX_FF,
        JULSWAP_FACTORY_ADDRESS,
        salt,
        JULSWAP_FACTORY_CODE
    ])
    let hash = _keccak256AsBuffer(data)

    return hash.slice(12)
}

/**
 * Build pool address on ApeSwap.
 *
 * @private
 * @param {EthAddress} addressA
 * @param {EthAddress} addressB
 * @returns {EthAddress}
 */
function _getPoolAddressApe(addressA, addressB) {
    let addresses = _sortAddressPair(addressA, addressB)
    let salt = _keccak256AsBuffer(
        Buffer.concat(addresses)
    )
    let data = Buffer.concat([
        HEX_FF,
        APESWAP_FACTORY_ADDRESS,
        salt,
        APESWAP_FACTORY_CODE
    ])
    let hash = _keccak256AsBuffer(data)

    return hash.slice(12)
}

/**
 * Build pool address on BurgerSwap.
 *
 * @private
 * @param {EthAddress} addressA
 * @param {EthAddress} addressB
 * @returns {EthAddress}
 */
function _getPoolAddressBurger(addressA, addressB) {
    let addresses = _sortAddressPair(addressA, addressB)
    let salt = _keccak256AsBuffer(
        Buffer.concat(addresses)
    )
    let data = Buffer.concat([
        HEX_FF,
        BURGERSWAP_FACTORY_ADDRESS,
        salt,
        BURGERSWAP_FACTORY_CODE
    ])
    let hash = _keccak256AsBuffer(data)

    return hash.slice(12)
}

/**
 * Build pool address on BiSwap.
 *
 * @private
 * @param {EthAddress} addressA
 * @param {EthAddress} addressB
 * @returns {EthAddress}
 */
function _getPoolAddressBi(addressA, addressB) {
    let addresses = _sortAddressPair(addressA, addressB)
    let salt = _keccak256AsBuffer(
        Buffer.concat(addresses)
    )
    let data = Buffer.concat([
        HEX_FF,
        BI_FACTORY_ADDRESS,
        salt,
        BI_FACTORY_INIT_CODE
    ])
    let hash = _keccak256AsBuffer(data)

    return hash.slice(12)
}

/**
 * Build pool address on MdexSwap.
 *
 * @private
 * @param {EthAddress} addressA
 * @param {EthAddress} addressB
 * @returns {EthAddress}
 */
function _getPoolAddressMdex(addressA, addressB) {
    let addresses = _sortAddressPair(addressA, addressB)
    let salt = _keccak256AsBuffer(
        Buffer.concat(addresses)
    )
    let data = Buffer.concat([
        HEX_FF,
        MDEX_FACTORY_ADDRESS,
        salt,
        MDEX_FACTORY_INIT_CODE
    ])
    let hash = _keccak256AsBuffer(data)

    return hash.slice(12)
}

/**
 * Build pool address on CafeSwap.
 *
 * @private
 * @param {EthAddress} addressA
 * @param {EthAddress} addressB
 * @returns {EthAddress}
 */
function _getPoolAddressCafe(addressA, addressB) {
    let addresses = _sortAddressPair(addressA, addressB)
    let salt = _keccak256AsBuffer(
        Buffer.concat(addresses)
    )
    let data = Buffer.concat([
        HEX_FF,
        CAFE_FACTORY_ADDRESS,
        salt,
        CAFE_FACTORY_INIT_CODE
    ])
    let hash = _keccak256AsBuffer(data)

    return hash.slice(12)
}

/**
 * Build pool address on JetSwap.
 *
 * @private
 * @param {EthAddress} addressA
 * @param {EthAddress} addressB
 * @returns {EthAddress}
 */
function _getPoolAddressJet(addressA, addressB) {
    let addresses = _sortAddressPair(addressA, addressB)
    let salt = _keccak256AsBuffer(
        Buffer.concat(addresses)
    )
    let data = Buffer.concat([
        HEX_FF,
        JET_FACTORY_ADDRESS,
        salt,
        JET_FACTORY_INIT_CODE
    ])
    let hash = _keccak256AsBuffer(data)

    return hash.slice(12)
}

/**
 * Build pool address on BabySwap.
 *
 * @private
 * @param {EthAddress} addressA
 * @param {EthAddress} addressB
 * @returns {EthAddress}
 */
function _getPoolAddressBaby(addressA, addressB) {
    let addresses = _sortAddressPair(addressA, addressB)
    let salt = _keccak256AsBuffer(
        Buffer.concat(addresses)
    )
    let data = Buffer.concat([
        HEX_FF,
        BABY_FACTORY_ADDRESS,
        salt,
        BABY_FACTORY_INIT_CODE
    ])
    let hash = _keccak256AsBuffer(data)

    return hash.slice(12)
}

/**
 * @private
 * @param {EthAddress} addressA
 * @param {EthAddress} addressB
 * @return {EthAddress}
 */
function _getPoolAddressOpenocean(addressA, addressB) {
    let addresses = _sortAddressPair(addressA, addressB)
    let salt = _keccak256AsBuffer(
        Buffer.concat(addresses)
    )
    let data = Buffer.concat([
        HEX_FF,
        OPENOCEAN_FACTORY_ADDRESS,
        salt,
        OPENOCEAN_FACTORY_INIT_CODE
    ])
    let hash = _keccak256AsBuffer(data)

    return hash.slice(12)
}

module.exports = {
    getPoolAddress,
    getPoolAddressHeximal,
    getExchangeAddress,
    toEthAddress,
    ExchangeName,
    _getPoolAddressPancake,
    _getPoolAddressPancake2,
    _getPoolAddressBakery,
    _getPoolAddressJul,
    _getPoolAddressApe,
    _getPoolAddressBurger,
    _getPoolAddressBi,
    _getPoolAddressMdex,
    _getPoolAddressCafe,
    _getPoolAddressJet,
    _getPoolAddressBaby,
    _getPoolAddressOpenocean,
    calculatePoolAddress,
    calculatePoolAddressHeximal
}
