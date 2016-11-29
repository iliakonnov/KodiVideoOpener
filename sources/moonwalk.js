// Moonwalk
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

