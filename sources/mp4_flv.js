// flv/mp4
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

