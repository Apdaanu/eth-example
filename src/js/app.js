App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  rlp: window.rlp,
  keccak: window.keccak,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initToken();
  },

  initToken: function() {
    $.getJSON("DappToken.json", function(token) {
      App.contracts.Token = TruffleContract(token);
      App.contracts.Token.setProvider(App.web3Provider);
      // App.listenForEventsToken();
      return App.initPower();
    })
  },

  initPower: function() {
    $.getJSON("Power.json", function(power) {
      App.contracts.Power = TruffleContract(power);
      App.contracts.Power.setProvider(App.web3Provider);
      // App.listenForEvents();
      return App.render();
    })
  },

  listenForEventsToken: function() {
    App.contracts.Token.deployed().then(function(instance) {
      instance.votedEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        App.render();
      });
    });
  },

  render: function() {
    var powerInstance;
    var tokenInstance;
    var loader = $("#loader");
    var content = $("#content");
    var powerCount;
    var powerVal;
    var powerAddr;

    loader.show();
    content.hide();

    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    App.contracts.Token.deployed().then(function(instance){
      tokenInstance = instance;
      return tokenInstance.balanceOf(App.account);
    }).then(function(amount){
        $("#accountTokens").html("Your Tokens: " + amount);
    })

    App.contracts.Power.deployed().then(function(instance) {
      powerInstance = instance;
      return powerInstance.powerCount();
    }).then(function(count){
      var powerAcc = $("#power");
      powerAcc.empty();
      powerCount = count;
      var addr = [];
      var count = 1;
      for(var i=1; i<= powerCount; i++){
        powerInstance.addressTable(i).then(function(address){
          addr.push(address);
          return powerInstance.powerTable(address)
        }).then(function(pow){
          var template = "<tr><th>" + count + "</th><td>" + addr[count-1] + "</td><td>" + pow + "</td></tr>"
          powerAcc.append(template);
          count++;
        })
      }

      loader.hide();
      content.show();
    })
  },

  givePower: function(){
    var powerInstance;
    var power = $('#powerInp').val();

    App.contracts.Power.deployed().then(function(instance){
      powerInstance = instance;
      return powerInstance.givePower(power);
    }).then(function(result){
      console.log({givePower: result});
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err){
      console.error(err);
    })
  },

  takePower: function() {
    var tokenInstance;

    var power = $('#powerInp').val();
    var producer = $('#powerProducer').val();
    App.contracts.Power.deployed().then(function(instance) {
      var powerInstance;
      powerInstance = instance;
      console.log(powerInstance.address)
      App.contracts.Token.deployed().then(function(instance){
        console.log("tokeninst deployed");
        tokenInstance = instance;
        return powerInstance.priceFactor()
      }).then(function(priceFactor){
          console.log("priceFactor calc")
          return tokenInstance.approve(powerInstance.address, priceFactor)
      }).then(function(result){
        console.log("Approved")
        return powerInstance.takePower(producer, power);
      }).then(function(result){
        console.log("transaction complete")
      }).catch(function(err){
        console.error(err);
      })
    }).then(function(result) {
      console.log("taken power")
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  },

  getAddressOfContract: function(_nonce){
    var nonce = 0x00; 
    var sender = '0x6ac7ea33f8831ea9dcc53393aaa88b25a785dbf0'; 

    var input_arr = [ sender, nonce ];
    var rlp_encoded = App.rlp.encode(input_arr);

    var contract_address_long = App.keccak('keccak256').update(rlp_encoded).digest('hex');

    var contract_address = contract_address_long.substring(24);
    console.log("contract_address: " + contract_address);
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});