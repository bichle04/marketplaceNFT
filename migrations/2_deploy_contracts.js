/* eslint-disable no-undef */
const ObsidianVerse = artifacts.require('ObsidianVerse')

module.exports = async (deployer) => {
  const accounts = await web3.eth.getAccounts()

  await deployer.deploy(ObsidianVerse, 'ObsidianVerse', 'OBV', 10, accounts[1])
}
