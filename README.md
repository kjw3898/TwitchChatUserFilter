# TwitchChatFilter
My attempt to make the Twitch.tv Chat more enjoyable.

## Installation

This is a UserScript for [TamperMonkey](https://www.tampermonkey.net/), so you need to install this Add-on or a similar script manager first.

After that, you can [open the raw script file](https://github.com/SapuSeven/TwitchChatFilter/raw/main/TwitchChatFilter.user.js) and TamperMonkey will prompt you to install the script.

You have to reload any opened Twitch.tv pages for the changes to take effect.

## Available filters

- Remove single word messages
- Remove commands
- Reduce repeating characters
- Remove repeating words
- Merge repeated emotes
- Remove single emote messages

## Known issues

- Settings are not yet implemented and filters cannot be configured
- Only the first visited chat will be filtered; A reload is required after navigating to another stream 

## Notes

Messages with purple background indicate an error during filtering.
