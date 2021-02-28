// ==UserScript==
// @name         Twitch Chat Filter
// @namespace    https://github.com/SapuSeven/TwitchChatFilter
// @version      1.0
// @description  Making the Twitch.tv Chat more enjoyable. Configure using the Twitch chat settings.
// @author       SapuSeven
// @updateURL   https://github.com/SapuSeven/TwitchChatFilter/raw/main/TwitchChatFilter.meta.js
// @downloadURL https://github.com/SapuSeven/TwitchChatFilter/raw/main/TwitchChatFilter.user.js
// @include     /^https?://(www\.)?twitch\.tv(\/.*)?$/
// @grant       none
// @run-at      document-end
// ==/UserScript==


// Filter ideas:
/*

- Hide "message deleted by a moderator." messages
- Hide more than 75% caps longer than 10 characters OR de-capitalize

Message deleted by moderator template:
<span class="chat-line__message--deleted-notice" data-a-target="chat-deleted-message-placeholder" data-test-selector="chat-deleted-message-placeholder">message deleted by a moderator.</span>

*/


var blacklist = ["settings", "wallet", "drops", "subscriptions", "friends", "directory"]

(function(code){
    "use strict"

    var s = document.createElement('script')
    s.appendChild(document.createTextNode(
        '(' + code.toString() + '());'
    ))
    document.body.appendChild(s)
}(function(){
    "use strict"

    // These filters are run on text message fragments
    const filters = [
        // Trim whitespace
        function(text) {
            return text.replaceAll(/^\s*(.*)\s*$/gi, "$1")
        },

        // Remove commands
        function(text) {
            return (text.startsWith("!")) ? "" : text
        },

        // Reduce repeating characters
        function(text) {
            return text.replaceAll(/([\D\S])\1{2,}/gi, "$1$1$1")
        },

        // Remove repeating words
        function(text) {
            return text.replaceAll(/\b(\w+)(?:\s+\1\b)+/gi, "$1")
        },
      
        // Remove single word messages
        function(text) {
            return (text.includes(" ")) ? text : ""
        },
    ]

    // These filters apply to whole message fragments, mainly to handle emotes
    const partFilters = [
        // Remove empty text fragments
        function(nodeList) {
            return nodeList.filter(item => {
                if (item.type == "text" && item.node.textContent.match(/^\s*$/)) {
                    item.node.style.display = "none"
                    return false
                }
                return true
            })
        },

        // Merge repeated emotes
        function(nodeList) {
            return nodeList.filter((item, pos, arr) => {
                if (item.type == "emote" && pos > 0 && item.content == arr[pos - 1].content) {
                    item.node.style.display = "none"
                    return false
                }
                return true
            })
        },

        // Remove single emote messages
        function(nodeList) {
            return (nodeList.length === 1 && nodeList[0].type == "emote") ? [] : nodeList
        },
    ]

    const waitForElement = async selector => {
        while (document.querySelector(selector) === null) {
            await new Promise(resolve => requestAnimationFrame(resolve))
        }
        return document.querySelector(selector)
    }

    function getEmoteText(node) {
        return node.querySelector("img").alt
    }

    function nodeMapping(node) {
        let type = node.classList.contains("text-fragment") ? "text" : "emote"

        return {
            type: type, // TODO: Handle mentions
            content: (type == "emote") ? getEmoteText(node) : null,
            node: node
        }
    }

    function processMessage(node) {
        try {
            let username = node.querySelector("[data-a-target=chat-message-username]")
            let messageParts = [...node.querySelectorAll("span.text-fragment, div.chat-line__message--emote-button")].map(nodeMapping) // TODO: Add span.mention-fragment

            messageParts.forEach(m => {
                if (m.type == "text") {
                    let text = m.node.textContent
                    filters.forEach(f => {
                        text = f(text)
                    })
                    m.node.textContent = text
                }
            })

            partFilters.forEach(f => {
                messageParts = f(messageParts)
            })

            if (messageParts.length === 0) {
                node.style.display = "none"
            }

            console.log("filtered messageParts for " + username.textContent, messageParts)
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
