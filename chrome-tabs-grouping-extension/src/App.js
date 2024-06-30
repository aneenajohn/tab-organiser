import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [tabs, setTabs] = useState([]);

  function updateTabs() {
    window.chrome.tabs
      .query({})
      .then((resp) => {
        console.log('From app: ', resp);
        setTabs(resp);
      })
      .catch((err) => console.error('Err from app:', err));
  }

  useEffect(() => {
    updateTabs();

    const handleMessage = (message) => {
      if (message.action === 'updateTabs') {
        updateTabs();
      }
    };

    window.chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      window.chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  const navigateToTab = (tabId) => {
    window.chrome.tabs.update(tabId, { active: true });
    window.chrome.windows.update(tabId, { focused: true });
  };

  return (
    <div className='App'>
      <p>Adei tabs vanduru olungaaa, body sodaaa</p>
      <div>
        {tabs?.length ? (
          <strong>
            Number of open tabs{' '}
            <span style={{ fontSize: '1.5rem', textDecoration: 'underline' }}>
              {tabs.length}
            </span>{' '}
          </strong>
        ) : (
          <></>
        )}
        {tabs?.length ? (
          tabs.map((tab) => (
            <div className='tab' onClick={() => navigateToTab(tab.id)}>
              <b>{tab.title}</b>
              <p>{tab.url}</p>
            </div>
          ))
        ) : (
          <p>No tabs found</p>
        )}
      </div>
    </div>
  );
}

export default App;
