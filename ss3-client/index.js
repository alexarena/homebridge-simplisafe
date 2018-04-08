require('any-promise/register/q')

var request = require('request-promise-any')
var Q = require('q')

function SS3Client(username, password) {
	this.username = username
	this.password = password
}

SS3Client.prototype.login = function() {
	var thisObj = this
	return this.initToken()
		.then(function() {
			return thisObj.initUserId()
		})
		.then(function() {
			return thisObj.initSubId()
		})
}

SS3Client.prototype.initToken = function() {
	var thisObj = this
	return request.post({
		url: 'https://api.simplisafe.com/v1/api/token',
		json: true,
		jar: true,
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			'Authorization': 'Basic NGRmNTU2MjctNDZiMi00ZTJjLTg2NmItMTUyMWIzOTVkZWQyLjEtMC0wLldlYkFwcC5zaW1wbGlzYWZlLmNvbTo='
		},
		body:
			{
				"grant_type": "password",
				"device_id": "WebApp",
				"username": thisObj.username,
				"password": thisObj.password
			}

	}).then(function(parsedBody) {
		var token = parsedBody.access_token
		thisObj.token = token
		thisObj.expires_in = parsedBody.expires_in
		thisObj.token_type = parsedBody.token_type
		var expireDate = new Date()
		expireDate.setSeconds(expireDate.getSeconds() + Math.round(thisObj.expires_in * 0.9));
		thisObj.expireDate = expireDate
	})
}

SS3Client.prototype.isExpired = function() {
	var currDate = new Date()
	return currDate > this.expireDate
}

SS3Client.prototype.initTokenIfNeeded = function() {
	if (this.isExpired()) {
		return this.initToken()
	} else {
		var deferred = Q.defer()
		deferred.resolve()
		return deferred.promise
	}
}

SS3Client.prototype.invokeSSGet = function(reqOptions) {
	return this.initTokenIfNeeded()
		.then(function() {
			return request.get(reqOptions)
		})
}

SS3Client.prototype.invokeSSPost = function(reqOptions) {
	return this.initTokenIfNeeded()
		.then(function() {
			return request.post(reqOptions)
		})
}

SS3Client.prototype.initUserId = function() {
	var thisObj = this
	return this.authCheck()
		.then(function(parsedBody) {
			var userId = parsedBody.userId
			thisObj.userId = userId
		})
}

SS3Client.prototype.initSubId = function() {
	var thisObj = this
	var reqOptions = {
		url: 'https://api.simplisafe.com/v1/users/' + thisObj.userId + '/subscriptions?activeOnly=false',
		json: true,
		jar: true,
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			'Authorization': thisObj.token_type + ' ' + thisObj.token
		}
	}
	return this.invokeSSGet(reqOptions)
		.then(function(parsedBody) {
				var subId = parsedBody.subscriptions[0].sid
				thisObj.subId = subId
			}
		)
}

/**
 * Set the alarm state
 *
 * @param state One of 'off', 'home', 'away'
 * @returns {*|PromiseLike<T>|Promise<T>}
 */
SS3Client.prototype.setState = function(state) {
	var thisObj = this
	var reqOptions = {
		url: 'https://api.simplisafe.com/v1/ss3/subscriptions/' + thisObj.subId + '/state/' + state,
		json: true,
		jar: true,
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			'Authorization': thisObj.token_type + ' ' + thisObj.token
		}
	}
	return this.invokeSSPost(reqOptions)
}

SS3Client.prototype.authCheck = function() {
	var thisObj = this
	var reqOptions = {
		url: 'https://api.simplisafe.com/v1/api/authCheck',
		json: true,
		jar: true,
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			'Authorization': thisObj.token_type + ' ' + thisObj.token
		}
	}
	return this.invokeSSGet(reqOptions)
}

SS3Client.prototype.getSub = function(subId) {
	var thisObj = this
	var reqOptions = {
		url: 'https://api.simplisafe.com/v1/subscriptions/' + thisObj.subId + '/',
		json: true,
		jar: true,
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			'Authorization': thisObj.token_type + ' ' + thisObj.token
		}
	}
	return this.invokeSSGet(reqOptions)
}

/**
 *
 * @returns {PromiseLike<T> | Promise<T>} Can be one of OFF, HOME, AWAY
 */
SS3Client.prototype.getAlarmState = function() {
	return this.getSub(this.subId)
		.then(function(parsedBody) {
				var alarmState = parsedBody.subscription.location.system.alarmState
				return alarmState
			}
		)
}

module.exports = SS3Client