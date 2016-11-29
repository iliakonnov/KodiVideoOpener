window.onload = function() {
    var bgPage = chrome.extension.getBackgroundPage();
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var result = bgPage.getResult(tabs[0].id);
        if (Object.keys(result).length != 0) {
            $("#id_container").show(0);
            $("#file_container").show(0);
            $("#kodi_container").show(0);
            $("#none").hide(0);

            $("#id").html(result["id"]);
            $("#file").prop("href", result["file"])
            $("#file").data("kodiUrl", result["kodi"])
        } else {
            $("#id_container").hide(0);
            $("#file_container").hide(0);
            $("#kodi_container").hide(0);
            $("#none").show(0);
        }

        chrome.storage.sync.get("advancedMode", function(obj) {
            obj = obj["advancedMode"];
            if (!obj) {
                $("#id_container").hide(0);
                $("#file_container").hide(0);
            }
        });
    });
    $("#kodi").click(function kodiOpen(url) {
        chrome.storage.sync.get("kodiAddr", function(kodiAddr) {
            kodiAddr = kodiAddr["kodiAddr"];
            $.post({
                url: kodiAddr+"/jsonrpc",
                dataType: "json",
                contentType:"application/json; charset=utf-8",
                data: JSON.stringify({
                    jsonrpc: "2.0",
                    method: "Player.Open",
                    params: {
                        item: {
                            file: $("#file").data("kodiUrl")
                        }
                    },
                    id: 1
                }),
                success: function(data) {
                    chrome.storage.sync.get("webInterface", function(webInterface) {
                        webInterface = webInterface["webInterface"];
                        result = !(data.hasOwnProperty("error"))
                        if ( result && webInterface) {
                            window.open(kodiAddr, '_blank');
                        } 
                        if ( !(result) ) {
                            alert("Error!");
                        }
                        chrome.storage.sync.get("alwaysResult", function(alwaysResult) {
                            alwaysResult = alwaysResult["alwaysResult"];
                            if ( !(result) || alwaysResult) {
                                var wnd = window.open("about:blank", "", "_blank");
                                wnd.document.write("<pre>" + JSON.stringify(data, null, 4) + "</pre>");
                            }
                        });
                    });
                }
            });
        });
    });
}
