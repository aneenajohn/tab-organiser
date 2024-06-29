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
  }, []);

  return (
    <div className='App'>
      <p>Adei tabs vanduru olungaaa, body sodaaa</p>
    </div>
  );
}

export default App;
