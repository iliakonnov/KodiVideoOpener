var results = {};

// Loading sources
[
    "mp4_flv",   // size>= 0
    "moonwalk",  // size= -1
    "youtube",   // size= -2
    "m3u8"       // size= -3
].forEach(function (item, i, arr) {
    var scriptEl = document.createElement('script');
    scriptEl.src = chrome.extension.getURL("sources/"+item+".js");
    scriptEl.addEventListener('load', function( data, textStatus, jqxhr ) {
        log('Source "'+item+'" loaded')
    }, false);
    document.head.appendChild(scriptEl);
});

function addResult(tabId, result) {
    if (Object.keys(result).length != 0) {
        log({
            tabId: tabId,
            result: result
        });
    }
    return results[tabId] = result;
}

function getResult(tabId) {
    return results[tabId];
}

function setIcon(tabId) {
    chrome.browserAction.setBadgeText({
        text: "Video!",
        tabId: tabId
    });
    chrome.browserAction.setIcon({
        path: {
            "16": "icons/video/icon16.png",
            "32": "icons/video/icon32.png",
            "48": "icons/video/icon48.png",
            "64": "icons/video/icon64.png",
            "128": "icons/video/icon128.png"
        },
        tabId: tabId
    });
}

function resetIcon(tabId) {
    chrome.browserAction.setBadgeText({
        text: "",
        tabId: tabId
    });
    chrome.browserAction.setIcon({
        path: {
            "16": "icons/normal/icon16.png",
            "32": "icons/normal/icon32.png",
            "48": "icons/normal/icon48.png",
            "64": "icons/normal/icon64.png",
            "128": "icons/normal/icon128.png"
        },
        tabId: tabId
    });
}

chrome.tabs.onRemoved.addListener( function(tabId, removeInfo) {
    delete results[tabId];
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if ( tab.hasOwnProperty("id") ) {  // Ignore special tabs
        if ( changeInfo.hasOwnProperty("url") ) {  // Only if url changed, not page loaded or something else.
            addResult(tabId, {});
            resetIcon(tabId);
        } else if (Object.keys(results[tabId]).length != 0) {  // If icon was resetted by update.
            setIcon(tabId);
        }
    }
});

chrome.tabs.onCreated.addListener( function(tab) {
    if ( tab.hasOwnProperty("id") ) {  // Ignore special tabs
        addResult(tab.id, {});
        resetIcon(tab.id);
    }
});

chrome.runtime.onInstalled.addListener( function(details) {
    chrome.runtime.openOptionsPage();
    chrome.tabs.query({}, function(tabs) {
        for (i in tabs) {
            if ( tabs[i].hasOwnProperty("id") ) {  // Ignore special tabs
                addResult(tabs[i].id, {});
            }
        }
    });
    chrome.storage.sync.set({
        'kodiAddr': "http://192.168.1.87:8080",
        'webInterface': true,
        'advancedMode': false,
        'alwaysResult': false
    });
});

function log(data) {
    chrome.extension.getBackgroundPage().console.log(data);
}

