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
