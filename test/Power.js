const Power = artifacts.require("Power.sol");
const Token = artifacts.require("DappToken.sol");

contract('Power', function(accounts){
	var powerInstance;

	it('initialized', function(){
		return Power.deployed().then(function(instance){
			powerInstance = instance;
			return powerInstance.powerCount();
		}).then(function(value){
			assert.equal(value, 0, 'OK');
			return powerInstance.priceFactor();
		}).then(function(value){
			assert.equal(value, 1, 'PriceFactor set');
		})
	})

	it('givePower and takePower', function(){
		var tokenInstance;
		var powerInstance;
		var producer = accounts[1];
		var buyer = accounts[2];

		return Token.deployed().then(function(instance){
			tokenInstance = instance;
		}).then(function(){
			return Power.deployed()
		}).then(function(instance){
			powerInstance = instance;
			return powerInstance.givePower(10, {from: producer});
		}).then(function(reciept){
			return powerInstance.powerTable(producer)
		}).then(function(value){
			assert.equal(value, 10, 'OK');
			return powerInstance.powerCount()
		}).then(function(count){
			assert.equal(count, 1, 'update power count')
			return powerInstance.addressTable(count)
		}).then(function(address){
			assert.equal(address, producer, 'address table updated');
		})
		// 	//First transfer money into buyer account
		// 	return tokenInstance.transfer(buyer, 10, {from: accounts[0]})
		// }).then(function(reciept){
		// 	//Allow Power Contract to spend
		// 	return tokenInstance.approve(powerInstance.address, 10, {from: buyer})
		// }).then(function(reciept){
		// 	return tokenInstance.allowance(buyer, powerInstance.address);
		// }).then(function(value){
		// 	assert.equal(value, 10, 'Not permited to spend')
		// 	//Now call takePower function
		// 	return powerInstance.takePower(producer, 10, {from: buyer})
		// }).then(function(reciept){
		// 	return tokenInstance.balanceOf(producer)
		// }).then(function(value){
		// 	assert.equal(value, 10, 'Token not recieved in producers account')
		// })
	})
})