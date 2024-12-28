import { useState } from "react";
import Downloader from "./components/Downloader";
import Settings from "./components/Settings";

const App = () => {
  const [currentPage, setCurrentPage] = useState("downloader");
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`min-h-screen flex ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"}`}>
      {/* 左侧导航栏 */}
      <nav className="w-64 bg-gradient-to-b from-blue-500 to-blue-300 text-white flex flex-col shadow-md">
        <div className="p-4">
          <h1 className="text-lg font-bold tracking-wide">视频转XHS文案生成器</h1>
        </div>
        <div className="mt-4 flex-1">
          <button
            onClick={() => setCurrentPage("downloader")}
            className={`w-full text-left px-4 py-3 font-medium rounded-l-full transition duration-300 my-2 ${
              currentPage === "downloader"
                ? "bg-white text-blue-700 shadow-md"
                : "hover:bg-blue-600"
            }`}
          >
            📥 处理任务
          </button>
          <button
            onClick={() => setCurrentPage("settings")}
            className={`w-full text-left px-4 py-3 font-medium rounded-l-full transition duration-300 my-2 ${
              currentPage === "settings"
                ? "bg-white text-blue-700 shadow-md"
                : "hover:bg-blue-600"
            }`}
          >
            ⚙️ 设置
          </button>
        </div>
        <div className="p-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-full px-4 py-2 text-sm rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition duration-200"
          >
            {darkMode ? "浅色模式" : "深色模式"}
          </button>
        </div>
        <footer className="p-4 text-center text-sm opacity-75">
          © 2024 媒体生成器
        </footer>
      </nav>

      {/* 右侧内容区域 */}
      <main className="flex-1 p-8">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 transition duration-300">
          {currentPage === "downloader" && <Downloader />}
          {currentPage === "settings" && <Settings />}
        </div>
      </main>
    </div>
  );
};

export default App;