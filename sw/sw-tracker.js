console.log("service worker tracker");

let activeTabId, lastUrl, lastDomain;

function getTabInfo(tabId) {
  chrome.tabs.get(tabId, function (tab) {
    if (lastUrl != tab.url || lastTitle != tab.title)
      console.log(
        (lastUrl = tab.url),
        (lastDomain = new URL(tab.url).hostname)
      );
  });
}

chrome.tabs.onActivated.addListener(function (activeInfo) {
  getTabInfo((activeTabId = activeInfo.tabId));
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (activeTabId == tabId) {
    getTabInfo(tabId);
  }
});
