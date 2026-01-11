import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import TaskManager from "./components/TaskManager";
import TaskDetails from "./components/TaskDetails";
import Settings from "./components/Settings";

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Router>
      <div className={`min-h-screen flex ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"}`}>
        {/* 左侧导航栏 */}
        <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} />

        {/* 右侧内容区域 */}
        <main className="flex-1 p-8">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 transition duration-300">
            <Routes>
              <Route path="/" element={<TaskManager />} />
              <Route path="/task/:id" element={<TaskDetails />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};

const Sidebar = ({ darkMode, setDarkMode }: { darkMode: boolean; setDarkMode: (mode: boolean) => void }) => {
  const location = useLocation();

  return (
    <nav className="w-64 bg-gradient-to-b from-blue-500 to-blue-300 text-white flex flex-col shadow-md">
      <div className="p-4">
        <h1 className="text-lg font-bold tracking-wide">视频转XHS文案生成器</h1>
      </div>
      <div className="mt-4 flex-1">
        <NavItem to="/" label="任务管理" active={location.pathname === "/"} />
        <NavItem to="/settings" label="设置" active={location.pathname === "/settings"} />
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
        MediaGen
      </footer>
    </nav>
  );
};

const NavItem = ({ to, label, active }: { to: string; label: string; active: boolean }) => (
  <Link
    to={to}
    className={`block w-full text-left px-4 py-3 font-medium rounded-l-full transition duration-300 my-2 ${
      active ? "bg-white text-blue-700 shadow-md" : "hover:bg-blue-600"
    }`}
  >
    {label}
  </Link>
);

export default App;
