const CrowdfundingFactory = artifacts.require("CrowdfundingFactory");
const Crowdfunding = artifacts.require("Crowdfunding");

contract("Crowdfunding", (accounts) => {
  const defaultMin = 100;

  it("should have the corresponding campaign owner address", async () => {
    const crowdfundingFactoryInstance = await CrowdfundingFactory.deployed();
    await crowdfundingFactoryInstance.createCampaign(defaultMin);
    const deployedCampaigns = await crowdfundingFactoryInstance.getDeployedCampaigns();
    const campaign = await Crowdfunding.at(deployedCampaigns[0]);

    const owner = await campaign.owner();
    const minimum = await campaign.minimumDonation();
    const donatorsCount = await campaign.donatorsCount();

    assert.equal(
      owner,
      accounts[0],
      "The first account was not the owner of the campaign"
    );
    assert.equal(
      defaultMin,
      minimum,
      "The minimum donation is not the default value given"
    );
    assert.equal(donatorsCount, 0, "The initial donators count is not 0");
  });
});
