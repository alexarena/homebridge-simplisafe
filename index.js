var Service, Characteristic;
var simplisafe = require('simplisafe');

var ssClient;

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-simplisafe", "SimpliSafe", SimpliSafe);
}

function SimpliSafe(log, config) {
  this.log = log;
  this.username = config["username"];
  this.password = config["password"];
  this.client;

  simplisafe({ user: this.username, password: this.password }, function (err, client) {
    ssClient = client;
  });


}

SimpliSafe.prototype.isHome = function(callback) {

  //console.log(ssClient.info.state);

  if(ssClient.info.state != 'home'){
    this.log("alarm IS NOT set to home");
    callback(null, false);
  }
  else{
    this.log("alarm IS set to home");
    callback(null, true);
  }

/*
  simplisafe({ user: this.username, password: this.password }, function (err, client) {
  if(err){
    console.log(err);
    callback(null, false);
  }
  else{

    if(client.info.state != 'home'){
      console.log("alarm IS NOT set to home");
      callback(null, false);
    }
    else{
      console.log("alarm IS set to home");
      callback(null, true);
    }

  }

  client.logout(function (er) {}) // Log out, clean out the connection

}) */
}

SimpliSafe.prototype.setHome = function(powerOn, callback) {

  if(ssClient.info.state != 'home'){
    ssClient.setState('home', function (err) {
        callback(null);
    })
  }
  else{ //Already set to home, turn off instead.
    ssClient.setState('off', function (err) {
        callback(null);
    })
  }


  /*
  simplisafe({ user: this.username, password: this.password}, function (err, client) {
    if (err){
      console.log(err);
    }

    if(client.info.state != 'home'){
      client.setState('home', function (err) {
          callback(null);
      })
    }

    client.logout(function (er) {}) // Log out, clean out the connection
  }) */
}

SimpliSafe.prototype.isAway = function(callback) {

  if(ssClient.info.state != 'away'){
    this.log("alarm IS NOT set to away");
    callback(null, false);
  }
  else{
    this.log("alarm IS set to away");
    callback(null, true);
  }

  /*

  simplisafe({ user: this.username, password: this.password }, function (err, client) {
  if(err){
    console.log(err);
    callback(null, false);
  }
  else{

    if(client.info.state != 'away'){
      console.log("alarm IS NOT set to away");
      callback(null, false);
    }
    else{
      console.log("alarm IS set to away");
      callback(null, true);
    }

  }

  client.logout(function (er) {}) // Log out, clean out the connection

}) */
}

SimpliSafe.prototype.setAway = function(powerOn, callback) {

  if(ssClient.info.state != 'away'){
    ssClient.setState('away', function (err) {
        callback(null);
    })
  }
  else{ //Already set to away, turn off instead.
    ssClient.setState('off', function (err) {
        callback(null);
    })
  }

  /*
  simplisafe({ user: this.username, password: this.password}, function (err, client) {
    if (err){
      console.log(err);
    }

    if(client.info.state != 'away'){
      client.setState('away', function (err) {
          callback(null);
      })
    }

    client.logout(function (er) {}) // Log out, clean out the connection
  }) */
}

SimpliSafe.prototype.getServices = function() {
    var homeSwitch = new Service.Switch("Home",'Home');

      homeSwitch
        .getCharacteristic(Characteristic.On)
        .on('get', this.isHome.bind(this))
        .on('set', this.setHome.bind(this))

    var awaySwitch = new Service.Switch("Away",'Away');

      awaySwitch
        .getCharacteristic(Characteristic.On)
        .on('get', this.isAway.bind(this))
        .on('set', this.setAway.bind(this))

    return [homeSwitch,awaySwitch];
}
