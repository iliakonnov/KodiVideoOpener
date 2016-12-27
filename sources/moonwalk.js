// Moonwalk
// Качество видео максимальное, даже если не смотреть рекламу, т.к. не передаётся часть параметров
chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        if (details.tabId != -1) {
            var formData = {};
            ["video_token", "mw_domain_id", "mw_key", "uuid", "content_type", "mw_pid"].forEach(function(elem){
                if (elem in details.requestBody.formData) {
                    formData[elem] = details.requestBody.formData[elem][0]
                }
            });
            
            $.post({
                type: "POST",
                url: details.url,
                data: formData,
                dataType: "json",
                headers: {
                    "X-Data-Pool": "Stream",
                    "X-Iframe-Option": "Direct",
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

