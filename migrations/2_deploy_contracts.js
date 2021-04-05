const CrowdfundingFactory = artifacts.require("CrowdfundingFactory");

module.exports = function (deployer) {
  deployer.deploy(CrowdfundingFactory, 10000000000000000);
};
