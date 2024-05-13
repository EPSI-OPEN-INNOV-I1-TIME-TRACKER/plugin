console.log("service worker tracker");

const API_URL = "";

let activeTabId, lastUrl, lastDomain, lastTitle;

function getTabInfo(tabId) {
  chrome.tabs.get(tabId, function (tab) {
    if (lastUrl != tab.url || lastTitle != tab.title)
      console.log(
        (lastUrl = tab.url),
        (lastDomain = new URL(tab.url).hostname)
      );

    /*
    chrome.runtime.sendNativeMessage(
      "com.epsi.timetracker",
      { domain: lastDomain },
      function (response) {
        console.log("Received " + response);
      }
    );
    */

    const data = {
      lastUrl: lastUrl,
      lastDomain: lastDomain,
    };

    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
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
