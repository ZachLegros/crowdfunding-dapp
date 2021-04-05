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
  struct Withdrawal {
    uint value;
    address recipient;
  }

  Withdrawal[] public withdrawals;
  address public owner;
  mapping(address => bool) donators;
  uint public donatorsCount;
  uint public minimumDonation;

  constructor(uint minimum, address fundraiser) {
    owner = fundraiser;
    minimumDonation = minimum;
  }

  receive() external payable {
    require(msg.value >= minimumDonation, "Donation under minimum value");
    require(msg.sender != owner, "Cannot donate as a campaign owner ");
    donators[msg.sender] = true;
    donatorsCount++;
  }

  modifier onlyOwner() {
    require(msg.sender == owner, "Sender is not the owner of the campaign");
    _;
  }

  function withdraw(uint value, address payable recipient) public onlyOwner {
    Withdrawal memory newWithdrawal = Withdrawal({ value: value, recipient: recipient });
    withdrawals.push(newWithdrawal);
    recipient.transfer(value);
  }

}