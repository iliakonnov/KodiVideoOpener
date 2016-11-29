function setElem(id, attr) {
    chrome.storage.sync.get(id, function(obj) {
        $("#"+id).prop(attr, obj[id]);
    });
}

window.onload = function() {
    $("#Ok").hide(0);
    setElem("kodiAddr", "value");
    setElem("webInterface", "checked");
    setElem("advancedMode", "checked");
    setElem("alwaysResult", "checked");
    $("#save").click(function() {
        chrome.storage.sync.set({
            'kodiAddr': $("#kodiAddr").prop("value"),
            'webInterface': $("#webInterface").prop("checked"),
            'advancedMode': $("#advancedMode").prop("checked"),
            'alwaysResult': $("#alwaysResult").prop("checked")
        });
        $("#Ok").show(0);
        $("#Ok").hide(2500);
    })
};
