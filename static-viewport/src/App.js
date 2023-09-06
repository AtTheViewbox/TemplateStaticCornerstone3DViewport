import './App.css';
import Layout from './layout/layout';
import { DataProvider } from './context/DataContext';
import { useEffect } from 'react';

function App() {

  useEffect(() => {
    console.log("App loaded")
  }, []);

  return (
    <div className="App">
      <DataProvider>
        <Layout />
      </DataProvider>
    </div>
  );
}

export default App;
