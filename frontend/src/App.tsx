import {useState} from 'react';
import Downloader from "./components/Downloader";
import Settings from './components/Settings';

function App() {
  const [currentPage, setCurrentPage] = useState("downloader");

  return (
    <div>
      <nav>
        <button onClick={() => setCurrentPage("downloader")}>下载器</button>
        <button onClick={() => setCurrentPage("settings")}>设置</button>
      </nav>
      {currentPage === "downloader" && <Downloader />}
      {currentPage === "settings" && <Settings />}
    </div>
  );
}

export default App
