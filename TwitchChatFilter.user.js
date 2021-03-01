// ==UserScript==
// @name         Twitch Chat User Filter
// @namespace    https://github.com/kjw3898/TwitchChatUserFilter/
// @version      1.0
// @description  Making the Twitch.tv Chat more enjoyable. Configure using the Twitch chat settings.
// @author       SapuSeven
// @updateURL   https://github.com/kjw3898/TwitchChatUserFilter/raw/main/TwitchChatFilter.meta.js
// @downloadURL https://github.com/kjw3898/TwitchChatUserFilter/raw/main/TwitchChatFilter.user.js
// @include     /^https?://(www\.)?twitch\.tv(\/.*)?$/
// @grant       none
// @run-at      document-end
// ==/UserScript==





var userList = ["user1", "user2", "user3"]
var isBlackListMode = true // true : blacklist mode (userList message not show), false : whitelist mode (userList message only show)
(function(code){
    "use strict"

    var s = document.createElement('script')
    s.appendChild(document.createTextNode(
        '(' + code.toString() + '());'
    ))
    document.body.appendChild(s)
}(function(){
    "use strict"

    const waitForElement = async selector => {
        while (document.querySelector(selector) === null) {
            await new Promise(resolve => requestAnimationFrame(resolve))
        }
        return document.querySelector(selector)
    }



    function processMessage(node) {
        try {
            let username = node.querySelector("[data-a-target=chat-message-username]")
            
            if((userList.indexOf(username)!=-1)==isBlackListMode){
                node.style.display = "none"
            }

        } catch (error) {
            // TODO: Remove try/catch once the code is fully tested
            console.error(error)
            node.style.background = "rgba(255, 0, 255, 0.2)"
        }
    }

    function onChatChange(mutations) {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.className == "chat-line__message") {
                    processMessage(node)
                } else {
                    console.log("Unknown message node: ", node)
                }
            })
        })
    }

    let observer = new MutationObserver(onChatChange)

    waitForElement('.chat-scrollable-area__message-container').then((selector) => {
        observer.observe(selector, {
            childList: true
        })
    })
}))

