import { useState } from "react";
import Downloader from "./components/Downloader";
import Settings from "./components/Settings";


const App = () =>  {
  const [currentPage, setCurrentPage] = useState("downloader");
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white shadow">
        <div className="container mx-auto flex justify-between items-center p-4">
          <h1 className="text-lg font-bold">媒体生成器</h1>
          <div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            切换模式
          </button>
            <button
              onClick={() => setCurrentPage("downloader")}
              className={`mr-4 px-4 py-2 rounded ${
                currentPage === "downloader"
                  ? "bg-white text-blue-600"
                  : "hover:bg-blue-500"
              }`}
            >
              下载器
            </button>
            <button
              onClick={() => setCurrentPage("settings")}
              className={`px-4 py-2 rounded ${
                currentPage === "settings"
                  ? "bg-white text-blue-600"
                  : "hover:bg-blue-500"
              }`}
            >
              设置
            </button>
          </div>
        </div>
      </nav>
      <main className="container mx-auto mt-8 p-4 bg-white shadow rounded">
        {currentPage === "downloader" && <Downloader />}
        {currentPage === "settings" && <Settings />}
      </main>
    </div>
  );
}

export default App;
