pragma solidity >=0.4.21 <0.7.0;

import "./DappToken.sol";

contract DappTokenSale {
  address admin;
  DappToken public tokenContract;
  uint256 public tokenPrice;
  uint256 public tokenSold;

  event Sell(
  	address _buyer, 
  	uint256 _amount
	);

  constructor(DappToken _tokenContract, uint256 _tokenPrice) public {
  	admin = msg.sender;
  	tokenContract = _tokenContract;
  	tokenPrice = _tokenPrice;
  }

  //multiply
  function multiply(uint256 x, uint256 y) internal pure returns(uint256 z){
  	require(y == 0 || (z = x*y)/y == x);
  }
  

  function buyTokens(uint256 _numberOfTokens) public payable {
  	require (msg.value == multiply(_numberOfTokens, tokenPrice));
  	//Require that there are enough tokens in contract
  	//Require that transfer successful

  	tokenSold += _numberOfTokens;
  	emit Sell(msg.sender, _numberOfTokens);
  }
  
}
