// m3u8
// Качество видео определяется KODI,
// либо на некотрых сайтах последнее установленное (MeGoGo.net)
chrome.webRequest.onHeadersReceived.addListener(
    function(details) {
        var url = details.url
        var filename = url.split("/").pop();
        var result = getResult(details.tabId);
        var size = (result.size == undefined) ? 0 : result.size;  // Zero if no result for this tab
        if (details.statusCode == 200) {  // MeGoGo sometimes gives 302
            if (size >= 0) {  // Not special sources
                addResult(details.tabId, {
                    id: filename,
                    file: url,
                    kodi: url,
                    size: -3
                });
                setIcon(details.tabId);
            }
        }
    },
    {urls: ["*://*/*.m3u8", "*://*/*.m3u8?*"]},
    ["responseHeaders"]
);
