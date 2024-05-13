console.log("service worker tracker");

const socket = new WebSocket("ws://localhost:3030/ws");

let activeTabId, lastUrl, lastDomain, lastTitle;

function getTabInfo(tabId) {
  chrome.tabs.get(tabId, function (tab) {
    if (lastUrl != tab.url || lastTitle != tab.title)
      console.log(
        (lastUrl = tab.url),
        (lastDomain = new URL(tab.url).hostname)
      );

    const data = JSON.stringify({
      lastUrl: lastUrl,
      lastDomain: lastDomain,
    });

    socket.send(data);
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
