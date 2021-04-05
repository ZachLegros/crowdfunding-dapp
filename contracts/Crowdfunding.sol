// SPDX-License-Identifier: GNU
pragma solidity ^0.8.0;

contract CrowdfundingFactory {
  Crowdfunding[] public deployedCampaigns;

  function createCampaign(uint minimum) public {
    Crowdfunding newCampaign = new Crowdfunding(minimum, msg.sender);
    deployedCampaigns.push(newCampaign);
  }

  function getDeployedCampaigns() public view returns(Crowdfunding[] memory) {
    return deployedCampaigns;
  }
}

contract Crowdfunding {
  address public owner;
  mapping(address => bool) donators;
  uint public donatorsCount;
  uint public minimumDonation;

  constructor(uint minimum, address fundraiser) {
    owner = fundraiser;
    minimumDonation = minimum;
  }

}