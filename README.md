# homebridge-simplisafe-ss3
homebridge-simplisafe-ss3 is a plugin for [Homebridge](https://github.com/nfarina/homebridge) that allows you to control your SimpliSafe security system through Homekit by using the ss3 version of the SimpliSafe REST APIs. 

## Installation

- Install Homebridge: `npm install -g homebridge`
- Install homebridge-simplisafe: `npm install -g https://github.com/chowielin/homebridge-simplisafe.git`

*Note:* These might require admin permissions to install, which you can get by prepending each command with `sudo`.

## Configuration 

Refer to `config-sample.json` for an example configuration file. Basically, the only thing you'll need to change is your SimpliSafe username and password. You'll need a Simplisafe plan that supports remote control from their iOS app, as this taps into the same API.

## Usage

Once installed, you should now have two SimpliSafe switches in your Home app. One turns the system on in 'Away' mode and the other does the same for 'Home' mode. 

## Thanks

Thanks to [@alexarena](https://github.com/alexarena) for this dead simple project.
Thanks to [@tobycth3](https://github.com/tobycth3) for the Groovy example of using the SimpliSafe ss3 version of the REST APIs.
