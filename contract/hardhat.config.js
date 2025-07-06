require('@nomicfoundation/hardhat-toolbox');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.24',
  networks: {
    hardhat: {
      chainId: 31337,
    },
    coston2: {
      url: 'https://coston2-api.flare.network/ext/bc/C/rpc',
      accounts: [process.env.PRIVATE_KEY],
      chainId: 114,
      gasPrice: 100000000000,
    },
    songbird: {
      url: 'https://songbird-api.flare.network/ext/bc/C/rpc',
      accounts: [process.env.PRIVATE_KEY],
      chainId: 19,
      gasPrice: 100000000000,
    },
  },
  etherscan: {
    apiKey: {
      coston2: 'YOUR_FLARESCAN_API_KEY',
      songbird: 'YOUR_FLARESCAN_API_KEY',
    },
    customChains: [
      {
        network: 'coston2',
        chainId: 114,
        urls: {
          apiURL: 'https://coston2-explorer.flare.network/api',
          browserURL: 'https://coston2-explorer.flare.network',
        },
      },
      {
        network: 'songbird',
        chainId: 19,
        urls: {
          apiURL: 'https://songbird-explorer.flare.network/api',
          browserURL: 'https://songbird-explorer.flare.network',
        },
      },
    ],
  },
};
