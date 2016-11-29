var results = {};

// ================================================= Moonwalk
chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        if (details.tabId != -1) {
            var formData = {
                video_token: details.requestBody.formData["video_token"][0],
                access_key: details.requestBody.formData["access_key"][0],
                mw_domain_id: details.requestBody.formData["mw_domain_id"][0]
            };
            
            $.post({
                type: "POST",
                url: details.url,
                data: formData,
                dataType: "json",
                headers: {
                    "X-Data-Pool": "Stream",
                    "X-Requested-With": "XMLHttpRequest"
                },
                success: function(data) {
                    //data = JSON.parse(xhr.responseText);

                    var url = data["mans"]["manifest_m3u8"];
                    var views = chrome.extension.getViews({
                        type: "popup"
                    });

                    addResult(details.tabId, {
                        id: url.split('/')[4],
                        file: url,
                        kodi: url,
                        size: -1
                    });
                    setIcon(details.tabId);
                }
            });
        }
    },
    {urls: ["*://*/*new_session"]},
    ["requestBody"]
);

// ================================================= flv/mp4
chrome.webRequest.onHeadersReceived.addListener(
    function(details) {
        if (details.tabId != 1) {
            var url = details.url;
            var length = details.responseHeaders.filter(function( obj ) {
                return obj.name == "Content-Length";
            })[0]["value"];
            var filename = url.split("/").pop().split(".");
            var extension = filename.pop();
            filename = filename[0];

            var result = getResult(details.tabId);
            if (Object.keys(result).length == 0) {  // Result for rhis tab is empty
                if (result.size != -1) {  // Not moonwalk or youtube
                    var size = (result.size == undefined) ? -1 : result.size;
                    if (size < length) {  // Filter ads
                        addResult(details.tabId, {
                            id: filename+extension+length,
                            file: url,
                            kodi: url,
                            size: length
                        });
                        setIcon(details.tabId);
                    }
                }
            }
        }
    },
    {urls: ["*://*/*.mp4", "*://*/*.mp4?*",
            "*://*/*.flv", "*://*/*.flv?*"]},
    ["responseHeaders"]
);

// ================================================= Youtube-playlist
chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        var playlistId = details.url;  // https://youtube.com/playlist?a=bcd&list=PLAYLISTID&e=fgh
        playlistId = playlistId.split("?")[1];  // a=bcd&list=PLAYLISTID&e=fgh
        playlistId = playlistId.split("&");  // ["a=bcd", "list=PLAYLISTID", "e=fgh"]
        for (i in playlistId) {
            if ( playlistId[i].split("=")[0] == "list" ) {
                playlistId = playlistId[i].split("=")[1];
                break;
            }
        }
        addResult(details.tabId, {
            id: "yt-playlist-" + playlistId,
            file: details.url,
            kodi: "plugin://plugin.video.youtube/play/?order=default&playlist_id=" + playlistId,
            size: -1
        });
        setIcon(details.tabId);
    },
    {urls: ["*://youtube.com/playlist?*", "*://www.youtube.com/playlist?*"]},
    []
);

// ================================================= Youtube-video
chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        var videoId = details.url;  // https://youtube.com/watch?a=bcd&v=VIDEOID&e=fgh
        videoId = videoId.split("?")[1];  // a=bcd&v=VIDEOID&e=fgh
        videoId = videoId.split("&");  // ["a=bcd", "v=VIDEOID", "e=fgh"]
        for (i in videoId) {
            if ( videoId[i].split("=")[0] == "v" ) {
                videoId = videoId[i].split("=")[1];
                break;
            }
        }
        addResult(details.tabId, {
            id: "yt-video-" + videoId,
            file: details.url,
            kodi: "plugin://plugin.video.youtube/play/?video_id=" + videoId,
            size: -1
        });
        setIcon(details.tabId);
    },
    {urls: ["*://youtube.com/watch?*", "*://www.youtube.com/watch?*"]},
    []
);

// ================================================= Another
function addResult(tabId, result) {
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
