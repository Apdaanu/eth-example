const DappToken = artifacts.require("DappToken");
const DappTokenSale = artifacts.require("DappTokenSale");
const Power = artifacts.require("Power");

module.exports = function(deployer) {
  deployer.deploy(DappToken, 1000000).then(function(){
  	var tokenPrice = 1000000000000000;	//0.001 Ether
  	return deployer.deploy(DappTokenSale, DappToken.address, tokenPrice);
  }).then(function(){
  	return deployer.deploy(Power, DappToken.address);
  })
};
