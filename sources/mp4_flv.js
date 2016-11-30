// flv/mp4
chrome.webRequest.onHeadersReceived.addListener(
    function(details) {
        if (details.tabId != 1) {
            var url = details.url;
            var length = details.responseHeaders.filter(function( obj ) {
                return obj.name == "Content-Length";
            });
            if ( length.length != 0) {
                length = [0]["value"];
            } else {
                length = 1;  // Ads may overwrite video!
            }
            var filename = url.split("/").pop();

            var result = getResult(details.tabId);
            var size = (result.size == undefined) ? 0 : result.size;  // Zero if no result for this tab
            if (size >= 0) {  // Not special sources
                if (size < length) {  // Filter ads
                    addResult(details.tabId, {
                        id: filename+length,
                        file: url,
                        kodi: url,
                        size: length
                    });
                    setIcon(details.tabId);
                }
            }
        }
    },
    {urls: ["*://*/*.mp4", "*://*/*.mp4?*",
            "*://*/*.flv", "*://*/*.flv?*"]},
    ["responseHeaders"]
);

