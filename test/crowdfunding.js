let tryCatch = require("./exceptions.js").tryCatch;
let errTypes = require("./exceptions.js").errTypes;
const CrowdfundingFactory = artifacts.require("CrowdfundingFactory");
const Crowdfunding = artifacts.require("Crowdfunding");

contract("CrowdfundingFactory", async (accounts) => {
  const defaultMin = 5000000000000000; // in wei
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

  it("cannot donate to own campaign", async () => {
    await factory.createCampaign(defaultMin);
    const deployedCampaigns = await factory.getDeployedCampaigns();
    const campaign = await Crowdfunding.at(deployedCampaigns[0]);

    await tryCatch(
      campaign.send(defaultMin, { from: accounts[0] }),
      errTypes.revert
    );
  });

  it("donate as non owner", async () => {
    await factory.createCampaign(defaultMin);
    const deployedCampaigns = await factory.getDeployedCampaigns();
    const campaign = await Crowdfunding.at(deployedCampaigns[0]);

    await campaign.send(defaultMin, { from: accounts[1] });
    const balance = await web3.eth.getBalance(campaign.address);
    const donatorsCount = await campaign.donatorsCount();

    assert.equal(
      balance,
      defaultMin,
      "The balance of the campaign did not update properly"
    );
    assert.equal(donatorsCount, 1, "The donators count was not incremented");
  });
});
