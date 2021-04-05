const CrowdfundingFactory = artifacts.require("CrowdfundingFactory");
const Crowdfunding = artifacts.require("Crowdfunding");

contract("Crowdfunding", (accounts) => {
  it("should have the corresponding campaign owner address", async () => {
    const crowdfundingFactoryInstance = await CrowdfundingFactory.deployed();
    await crowdfundingFactoryInstance.createCampaign(100);
    const deployedCampaigns = await crowdfundingFactoryInstance.getDeployedCampaigns();
    const campaign = await Crowdfunding.at(deployedCampaigns[0]);

    const owner = await campaign.owner();

    assert.equal(
      owner,
      accounts[0],
      "The first account was not the owner of the campaign"
    );
  });
});
