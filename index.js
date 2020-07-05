var SS3Client = require('./ss3-client')

var Service, Characteristic;

var ss3Client;

module.exports = function(homebridge) {
	Service = homebridge.hap.Service;
	Characteristic = homebridge.hap.Characteristic;
	homebridge.registerAccessory("homebridge-simplisafe", "SimpliSafe", SimpliSafe);
}

function SimpliSafe(log, config) {
	this.log = log;
	this.username = config["username"];
	this.password = config["password"];

	ss3Client = new SS3Client(this.username, this.password)

	ss3Client.login()
		.then(function() {
			log('ss3Client.token: ' + ss3Client.token)
			log('ss3Client.userId: ' + ss3Client.userId)
			log('ss3Client.subId: ' + ss3Client.subId)
			return ss3Client.getAlarmState()
		})
		.then(function(alarmState) {
			log('alarmState: ' + alarmState)
		})
}

SimpliSafe.prototype.isHome = function(callback) {
	var thisObj = this
	ss3Client.getAlarmState().then(function(alarmState) {
		if (alarmState.startsWith('HOME')) {
			thisObj.log("alarm IS set to home");
			callback(null, true)
		} else {
			thisObj.log("alarm IS NOT set to home: " + alarmState);
			callback(null, false);
		}
	})
}

SimpliSafe.prototype.setHome = function(powerOn, callback) {
	this.log('setHome powerOn: ' + powerOn)
	ss3Client.setState(powerOn ? 'home' :'off')
		.then(function() {
			callback(null)
		})
}

SimpliSafe.prototype.isAway = function(callback) {
	var thisObj = this
	ss3Client.getAlarmState().then(function(alarmState) {
		if (alarmState.startsWith('AWAY')) {
			thisObj.log("alarm IS set to away");
			callback(null, true)
		} else {
			thisObj.log("alarm IS NOT set to away: " + alarmState);
			callback(null, false);
		}
	})
}

SimpliSafe.prototype.setAway = function(powerOn, callback) {
	this.log('setAway powerOn: ' + powerOn)
	ss3Client.setState(powerOn ? 'away' :'off')
		.then(function() {
			callback(null)
		})
}

SimpliSafe.prototype.getServices = function() {
	var homeSwitch = new Service.Switch("Home", 'Home');

	homeSwitch
		.getCharacteristic(Characteristic.On)
		.on('get', this.isHome.bind(this))
		.on('set', this.setHome.bind(this))

	var awaySwitch = new Service.Switch("Away", 'Away');

	awaySwitch
		.getCharacteristic(Characteristic.On)
		.on('get', this.isAway.bind(this))
		.on('set', this.setAway.bind(this))

	return [homeSwitch, awaySwitch];
}