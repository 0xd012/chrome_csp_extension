var filters = { urls: ["<all_urls>"], types: ["main_frame"] };
var csp_info = {};

function handleHeadersReceived(details) {
    csp_info[details.tabId] = {};
    csp_info[details.tabId].icon = '';
    csp_info[details.tabId].tooltip = '';
    for (i = 0; i < details.responseHeaders.length; i++) {
        if (isCSPHeader(details.responseHeaders[i].name.toUpperCase())) {
            csp_info[details.tabId].icon = "csp";
            csp_info[details.tabId].tooltip = details.responseHeaders[i].value;
        }
    }
}

function handleUpdated(tabId, changeInfo, tab) {
    if (typeof csp_info[tabId] !== 'undefined') {
        if (typeof csp_info[tabId].icon !== 'undefined') {
            if (csp_info[tabId].icon == 'csp') {
                chrome.pageAction.setIcon({
                    path: '/icons/icon-' + csp_info[tabId].icon + '.png',
                    tabId: tabId
                });
                chrome.pageAction.setTitle({
                    title: 'CSP-enabled with following security policy\n' + csp_info[tabId].tooltip,
                    tabId: tabId
                });
                chrome.pageAction.show(tabId);
            }
        }
    }
}

function isCSPHeader(header) {
    return (header == 'CONTENT-SECURITY-POLICY') || (header == 'X-WEBKIT-CSP') || (header == 'X-CONTENT-SECURITY-POLICY');
}

chrome.webRequest.onHeadersReceived.addListener(handleHeadersReceived, filters, ['responseHeaders']);
chrome.tabs.onUpdated.addListener(handleUpdated);