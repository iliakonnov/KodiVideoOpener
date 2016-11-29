// Youtube-playlist
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
            size: -2
        });
        setIcon(details.tabId);
    },
    {urls: ["*://youtube.com/playlist?*", "*://www.youtube.com/playlist?*"]},
    []
);

// Youtube-video
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
