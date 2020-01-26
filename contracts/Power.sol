pragma solidity >=0.4.21 <0.7.0;

import "./DappToken.sol";

contract Power {
  DappToken public tokenContract;
	uint public powerCount;
	uint public priceFactor;

	mapping (address => uint) public powerTable;
  mapping (uint => address) public addressTable;

  constructor(DappToken _tokenContract) public {
  	tokenContract = _tokenContract;
  	powerCount = 0;  
  	priceFactor = 1;
  }

  function givePower(uint _power) public{
    require (_power > 0);
    if(powerTable[msg.sender] == 0){
      powerCount += 1;
      addressTable[powerCount] = msg.sender;
  	  powerTable[msg.sender] += _power;
    }
    else{
      powerTable[msg.sender] += _power;
    }
  }

  function revokeTokens(uint _tokens) public{
  	tokenContract.transferFrom(msg.sender, msg.sender, _tokens);
  }

  function takePower(address _producer, uint _power) public{
  	require(_producer != msg.sender);	//check that producre isn't buying his own power
  	require(powerTable[_producer] >= _power);	//check availability of power
  	// require(tokenContract.allowance(msg.sender, address(this)) >= _power*priceFactor);	//check whether buyer has submitted amount or not.
  	require(tokenContract.balanceOf(msg.sender) >= _power*priceFactor);	//check if buyer has appropriate balance

  	tokenContract.transferFrom(msg.sender, _producer, _power*priceFactor);
  	powerTable[_producer] -= _power;
    if(_power == powerTable[_producer]){
      powerCount -= 1;
    }
  }
}
