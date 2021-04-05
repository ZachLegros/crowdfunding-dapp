const CrowdfundingFactory = artifacts.require("CrowdfundingFactory");
const Crowdfunding = artifacts.require("Crowdfunding");

contract("CrowdfundingFactory", async (accounts) => {
  const defaultMin = 100;
  let factory;

  before(async () => {
    factory = await CrowdfundingFactory.deployed();
  });

  it("has correct owner address", async () => {
    await factory.createCampaign(defaultMin);
    const deployedCampaigns = await factory.getDeployedCampaigns();
    const campaign = await Crowdfunding.at(deployedCampaigns[0]);
    const owner = await campaign.owner();
    assert.equal(
      owner,
      accounts[0],
      "The first account was not the owner of the campaign"
    );
  });

  it("has default minimum donation value", async () => {
    await factory.createCampaign(defaultMin);
    const deployedCampaigns = await factory.getDeployedCampaigns();
    const campaign = await Crowdfunding.at(deployedCampaigns[0]);
    const minimum = await campaign.minimumDonation();
    assert.equal(
      defaultMin,
      minimum,
      "The minimum donation is not the default value given"
    );
  });

  it("has 0 initial donations", async () => {
    await factory.createCampaign(defaultMin);
    const deployedCampaigns = await factory.getDeployedCampaigns();
    const campaign = await Crowdfunding.at(deployedCampaigns[0]);
    const donatorsCount = await campaign.donatorsCount();
    assert.equal(donatorsCount, 0, "The initial donators count is not 0");
  });
});
