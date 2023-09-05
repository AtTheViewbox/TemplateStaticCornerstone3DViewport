import './App.css';
import Viewport from './viewport/viewport';
import Layout from './layout/layout';
import { DataProvider } from './context/DataContext';

function App() {
  return (
    <div className="App">
      <DataProvider>
        <Layout />
      </DataProvider>
    </div>
  );
}

export default App;
