# TwitchChatUserFilter
You can filter user on twitch.tv chat
this repository forked form [SapuSeven/TwitchChatFilter](https://github.com/SapuSeven/TwitchChatFilter)

## Installation

This is a UserScript, so you need to install a script manager like [GreaseMonkey](https://greasespot.net/) or [TamperMonkey](https://tampermonkey.net/) first.

After that, you can [open the raw script file](https://github.com/kjw3898/TwitchChatUserFilter/raw/main/TwitchChatFilter.user.js) and your manager will prompt you to install the script.
you can set mode blacklist or whitelist
You have to reload any opened Twitch.tv pages for the changes to take effect.

## Available filters

- white list user
- black list user

## Known issues

- Settings are not yet implemented and filters cannot be configured
- Only the first visited chat will be filtered; A reload is required after navigating to another stream 

## Notes

Messages with purple background indicate an error during filtering.
