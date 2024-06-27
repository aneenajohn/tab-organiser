console.log('From tabs extension');

chrome.tabs
  .query({})
  .then((resp) => console.log(resp))
  .catch((err) => console.error('Error occured: ', err));
