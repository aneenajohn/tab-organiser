console.log('From tabs extension');

chrome.tabs
  .query({})
  .then((resp) => console.log(resp))
  .catch((err) => console.error('Error occured: ', err));

chrome.action.onClicked.addListener(() => {
  console.log('Clicked');
  chrome.tabs.create({
    url: 'index.html',
    active: !0,
  });
});

chrome.tabs.onCreated.addListener(() => {
  chrome.runtime.sendMessage({ action: 'updateTabs' });
});

chrome.tabs.onRemoved.addListener(() => {
  chrome.runtime.sendMessage({ action: 'updateTabs' });
});

chrome.tabs.onUpdated.addListener(() => {
  chrome.runtime.sendMessage({ action: 'updateTabs' });
});

chrome.tabs.onActivated.addListener(() => {
  chrome.runtime.sendMessage({ action: 'updateTabs' });
});

let lastClosedTab = null;

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  if (!removeInfo.isWindowClosing) {
    chrome.sessions.getRecentlyClosed({ maxResults: 1 }, (sessions) => {
      if (sessions.length > 0 && sessions[0].tab) {
        lastClosedTab = sessions[0];
      }
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getLastClosedTab') {
    sendResponse({ lastClosedTab });
  }
});
