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
