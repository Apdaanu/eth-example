// var DappToken = artifacts.require("./DappToken.sol");

// contract('DappToken', function(accounts){

// 	it('initializes the contract with the correct values', function(){
// 		return DappToken.deployed().then(function(instance){
// 			tokenInstance = instance;
// 			return tokenInstance.name();
// 		}).then(function(name){
// 			assert.equal(name, 'Dapp Token', 'Checks if the name is correct');
// 			return tokenInstance.symbol();
// 		}).then(function(symbol){
// 			assert.equal(symbol, 'DAPP', 'Checks if symbol is correct');
// 			return tokenInstance.standard();
// 		}).then(function(standard){
// 			assert.equal(standard, 'Dapp Token v1.0')
// 		});
// 	});

// 	it('allocates initial supply upon deployment', function(){
// 		return DappToken.deployed().then(function(instance){
// 			tokenInstance = instance;
// 			return tokenInstance.totalSupply();
// 		}).then(function(totalSupply){
// 			assert.equal(totalSupply.toNumber(), 1000000, 'sets total supply to 1mn')
// 			return tokenInstance.balanceOf(accounts[0]);
// 		}).then(function(adminBalance){
// 			assert.equal(adminBalance.toNumber(), 1000000, 'it allocates the initial supply to the admin account')
// 		});
// 	});

// 	it('transfers token ownership', function(){
// 		return DappToken.deployed().then(function(instance){
// 			tokenInstance = instance;
// 			return tokenInstance.transfer.call(accounts[1], 999999999999);
// 		}).then(assert.fail).catch(function(error){
// 			assert(error.message.indexOf('revert') >= 0, 'error message must contain revert')
// 			return tokenInstance.transfer.call(accounts[1], 250000, {from: accounts[0]})
// 		}).then(function(success){
// 			assert.equal(success, true, 'returns true')
// 			return tokenInstance.transfer(accounts[1], 250000, {from: accounts[0]})
// 		}).then(function(receipt){
// 			assert.equal(receipt.logs.length, 1, 'triggers one event');
// 			assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event')
// 			assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account from where tokens are debited');
// 			assert.equal(receipt.logs[0].args._to, accounts[1], 'logst he acount to which the tokens are credited to');
// 			assert.equal(receipt.logs[0].args._value, 250000, 'logs the transfer amount');
// 			return tokenInstance.balanceOf(accounts[1])
// 		}).then(function(balance){
// 			assert.equal(balance.toNumber(), 250000, 'adds amount to receiving account');
// 			return tokenInstance.balanceOf(accounts[0]);
// 		}).then(function(balance){
// 			assert.equal(balance.toNumber(), 750000, 'deducts the amount from the sending acount');
// 		})
// 	});

// 	it('approves tokens for delagated transfer', function(){
// 		return DappToken.deployed().then(function(instance){
// 			tokenInstance = instance;
// 			return tokenInstance.approve.call(accounts[1], 100);
// 		}).then(function(success){
// 			assert.equal(success, true, 'return true');
// 			return tokenInstance.approve(accounts[1], 100, {from: accounts[0]});
// 		}).then(function(receipt){
// 			assert.equal(receipt.logs.length, 1, 'triggers one event');
// 			assert.equal(receipt.logs[0].event, 'Approval', 'should be the "Approval" event')
// 			assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs the account from where tokens are debited');
// 			assert.equal(receipt.logs[0].args._spender, accounts[1], 'logst he acount to which the tokens are credited to');
// 			assert.equal(receipt.logs[0].args._value, 100, 'logs the transfer amount');
// 			return tokenInstance.allowance(accounts[0], accounts[1]);
// 		}).then(function(allowance){
// 			assert.equal(allowance.toNumber(), 100, 'stores the allowance for delegated transfer')
// 		});
// 	});

// 	it('handles deligated transfer', function(){
// 		return DappToken.deployed().then(function(instance){
// 			tokenInstance = instance;
// 			fromAccount = accounts[2];
// 			toAccount = accounts[3];
// 			spendingAccount = accounts[4];
// 			//Transfer some tokens to fromAccount
// 			return tokenInstance.transfer(fromAccount, 100, {from: accounts[0]})
// 		}).then(function(receipt){
// 			//Approve spendingAccount to spend 10 tokens from fromAccount
// 			return tokenInstance.approve(spendingAccount, 10, {from: fromAccount})
// 		}).then(function(receipt){
// 			//Try transfering something larger than the senders balance
// 			return tokenInstance.transferFrom(fromAccount, toAccount, 1000, {from: spendingAccount})
// 		}).then(assert.fail).catch(function(error){
// 			assert(error.message.indexOf('revert') >=0, 'can not transfer value larger than the balance');
// 			//Try transfering something larger than the approved amount
// 			return tokenInstance.transferFrom(fromAccount, toAccount, 20, {from: spendingAccount})
// 		}).then(assert.fail).catch(function(error){
// 			assert(error.message.indexOf('revert') >=0, 'can not transfer value larger than the approved amount');
// 			return tokenInstance.transferFrom.call(fromAccount, toAccount, 5, {from: spendingAccount})
// 		}).then(function(success){
// 			assert.equal(success, true);
// 			return tokenInstance.transferFrom(fromAccount, toAccount, 10, {from: spendingAccount});
// 		}).then(function(receipt){
// 			assert.equal(receipt.logs.length, 1, 'triggers one event');
// 			assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event')
// 			assert.equal(receipt.logs[0].args._from, fromAccount, 'logs the account from where tokens are debited');
// 			assert.equal(receipt.logs[0].args._to, toAccount, 'logst he acount to which the tokens are credited to');
// 			assert.equal(receipt.logs[0].args._value, 10, 'logs the transfer amount');
// 			return tokenInstance.balanceOf(fromAccount);
// 		}).then(function(balance){
// 			assert.equal(balance.toNumber(), 90, 'deducts the amount from the sending account')
// 			return tokenInstance.balanceOf(toAccount)
// 		}).then(function(balance){
// 			assert.equal(balance.toNumber(), 10, 'adds the balance to the receiving account')
// 			return tokenInstance.allowance(fromAccount, spendingAccount);
// 		}).then(function(allowance){
// 			assert.equal(allowance, 0, 'deducts the amount from the allowance')
// 		})
// 	})
// });