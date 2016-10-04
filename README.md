# homebridge-simplisafe
homebridge-simplisafe is a plugin for [Homebridge](https://github.com/nfarina/homebridge) that allows you to control your SimpliSafe security system through Homekit. All of this is pretty much one big hack, so it should be approached with a healthy DIY spirit. 

## Installation

- Install Homebridge: `npm install -g homebridge`
- Install homebridge-simplisafe: `npm install -g homebridge-simplisafe`

*Note:* These might require admin permissions to install, which you can get by prepending each command with `sudo`.

## Configuration 

Refer to `config-sample.json` for an example configuration file. Basically, the only thing you'll need to change is your SimpliSafe username and password. You'll need a Simplisafe plan that supports remote control from their iOS app, as this taps into the same API.

## Usage

Once installed, you should now have two SimpliSafe switches in your Home app. One turns the system on in 'Away' mode and the other does the same for 'Home' mode. 

## Roadmap

homebridge-simplisafe currently works by adding the two aforementioned switches in Homekit. I'd much rather this integrate as a proper Homekit Security System, but it's being a bit finicky at the moment. I won't say this change is coming soon, but I plan to get around to it eventually. It also only supports a single location which isn't likely to change, given that I only have SimpliSafe at one house and the SimpliSafe Node module that I'm using doesn't support multiple locations, either.

## Thanks

Many thanks to [@greencoder](https://github.com/greencoder) for [reverse-engineering the SimpliSafe API](http://www.leftovercode.info/simplisafe.php), [@searls](https://github.com/searls/) for using that to create the [SimpliSafe Node wrapper](https://github.com/searls/simplisafe) and, of course, to [@nfarina](https://github.com/nfarina/) for creating Homebridge.
