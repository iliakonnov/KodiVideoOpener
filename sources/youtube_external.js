//Youtube-external
chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        var videoId = details.url;
        videoId = videoId.split("?")[1];  // a=bcd&v=VIDEOID&el=adunit
        videoId = videoId.split("&");  // ["a=bcd", "v=VIDEOID", "el=adunit"]
        var splitted = "";
        var result = "";
        for (i in videoId) {
            splitted = videoId[i].split("=")
            if ( splitted[0] == "video_id" ) {
                result = splitted[1];
            } else if ( splitted[0] == "el" ) {
                if ( splitted[1] == "adunit" ) {
                    result = "";
                    break;
                }
            }
        }
        var result = getResult(details.tabId);
        var size = (result.size == undefined) ? 0 : result.size;  // Zero if no result for this tab
        if ( result != "" ) {
            if (size >= 0) {  // Not special sources
                addResult(details.tabId, {
                    id: "yt-videoExternal-" + videoId,
                    file: details.url,
                    kodi: "plugin://plugin.video.youtube/play/?video_id=" + videoId,
                    size: -1
                });
                setIcon(details.tabId);
            }
        }
    },
    {urls: ["*://www.youtube.com/get_video_info?*", "*://*.youtube.com/get_video_info?*"]},
    []
);
