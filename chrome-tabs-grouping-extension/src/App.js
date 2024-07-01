import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [tabs, setTabs] = useState([]);
  const [lastClosedTab, setLastClosedTab] = useState(null);

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

  const pinTab = (tabId, pinned) => {
    window.chrome.tabs.update(tabId, { pinned: !pinned });
  };

  const closeTab = (tabId) => {
    window.chrome.tabs.remove(tabId);
  };

  const shouldMoveTabs = (sortedTabs) => {
    moveTabs(sortedTabs);
  };

  const sortTabsByTitle = (isMoveTabAllowed) => {
    console.log({ isMoveTabAllowed });
    const sortedTabs = [...tabs].sort((a, b) => a.title.localeCompare(b.title));
    setTabs(sortedTabs);
    if (isMoveTabAllowed) shouldMoveTabs(sortedTabs);
  };

  const sortTabsByUrl = (isMoveTabAllowed) => {
    console.log({ isMoveTabAllowed });
    const sortedTabs = [...tabs].sort((a, b) => a.url.localeCompare(b.url));
    setTabs(sortedTabs);
    if (isMoveTabAllowed) shouldMoveTabs(sortedTabs);
  };

  const sortTabsByPinned = (isMoveTabAllowed) => {
    console.log({ isMoveTabAllowed });
    const sortedTabs = [...tabs].sort((a, b) => b.pinned - a.pinned);
    setTabs(sortedTabs);
    if (isMoveTabAllowed) shouldMoveTabs(sortedTabs);
  };

  const moveTabs = (sortedTabs) => {
    sortedTabs.forEach((tab, index) => {
      window.chrome.tabs.move(tab.id, { index });
    });
    setTabs(sortedTabs);
  };

  const reopenLastClosedTab = () => {
    if (lastClosedTab) {
      window.chrome.sessions
        .restore(lastClosedTab.tab.sessionId)
        .then(() => {
          setLastClosedTab(null);
        })
        .catch((err) => console.error('Failed to restore tab:', err));
    }
  };

  return (
    <div className='App' style={{ margin: '1rem', fontSize: '1.5rem' }}>
      <b>Adei tabs vanduru olungaaa, body sodaaa</b>
      <div>
        {tabs?.length ? (
          <>
            <strong style={{ margin: '1.5rem' }}>
              Number of open tabs{' '}
              <span style={{ fontSize: '1.5rem', textDecoration: 'underline' }}>
                {tabs.length}
              </span>{' '}
            </strong>
            <button onClick={reopenLastClosedTab} disabled={!lastClosedTab}>
              Reopen Last Closed Tab
            </button>
          </>
        ) : (
          <></>
        )}
        {tabs.length ? (
          <>
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                margin: '1rem',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <button onClick={() => sortTabsByTitle(false)}>
                Sort by Title
              </button>
              <button onClick={() => sortTabsByTitle(false)}>
                Sort by URL
              </button>
              <button onClick={() => sortTabsByTitle(false)}>
                Sort by Pinned Status
              </button>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '1rem',
                margin: '1rem',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <button onClick={() => sortTabsByTitle(true)}>
                Sort and move tads by Title
              </button>
              <button onClick={() => sortTabsByTitle(true)}>
                Sort and move tads by URL
              </button>
              <button onClick={() => sortTabsByTitle(true)}>
                Sort and move tads by Pinned Status
              </button>
            </div>
          </>
        ) : (
          <></>
        )}
        {tabs?.length ? (
          tabs.map((tab) => (
            <div
              className='tab'
              key={tab.id}
              style={{
                border: '1px solid #ccc',
                padding: '10px',
                marginBottom: '10px',
                borderRadius: '5px',
              }}
            >
              <div onClick={() => navigateToTab(tab.id)}>
                <b>{tab.title}</b>
                <p>{tab.url}</p>
              </div>
              <button
                onClick={() => pinTab(tab.id, tab.pinned)}
                style={{ marginRight: '10px' }}
              >
                {tab.pinned ? 'Unpin' : 'Pin'}
              </button>
              <button
                onClick={() => closeTab(tab.id)}
                style={{ marginRight: '10px' }}
              >
                Close tab
              </button>
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
