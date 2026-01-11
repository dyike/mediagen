import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import TaskManager from "./components/TaskManager";
import TaskDetails from "./components/TaskDetails";
import Settings from "./components/Settings";

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Router>
      <div className={`h-screen flex ${darkMode ? "dark" : ""}`}>
        {/* 左侧导航栏 */}
        <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} />

        {/* 右侧区域 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* 右侧顶部标题栏 */}
          <ContentHeader darkMode={darkMode} />

          {/* 右侧内容区域 */}
          <main className={`flex-1 overflow-auto ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}>
            <Routes>
              <Route path="/" element={<TaskManager />} />
              <Route path="/task/:id" element={<TaskDetails />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

const ContentHeader = ({ darkMode }: { darkMode: boolean }) => {
  const location = useLocation();

  const getTitle = () => {
    if (location.pathname === "/") return "任务管理";
    if (location.pathname === "/settings") return "设置";
    if (location.pathname.startsWith("/task/")) return "任务详情";
    return "";
  };

  return (
    <header
      className={`h-12 flex items-center px-4 border-b flex-shrink-0 ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"
      }`}
      style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
    >
      <span className={`font-medium ${darkMode ? "text-gray-100" : "text-gray-700"}`}>
        {getTitle()}
      </span>
    </header>
  );
};

const Sidebar = ({ darkMode, setDarkMode }: { darkMode: boolean; setDarkMode: (mode: boolean) => void }) => {
  const location = useLocation();

  return (
    <nav
      className={`w-56 flex flex-col border-r flex-shrink-0 ${
        darkMode ? "bg-gray-900 border-gray-700" : "bg-gray-100 border-gray-200"
      }`}
    >
      {/* 顶部区域 - 交通灯占位 + 标题 */}
      <div
        className="h-12 flex items-center px-4 flex-shrink-0"
        style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
      >
        {/* 交通灯占位 */}
        <div className="w-16 flex-shrink-0"></div>
        <span className={`text-sm font-semibold ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
          MediaGen
        </span>
      </div>

      {/* 导航菜单 - 可滚动 */}
      <div className="flex-1 overflow-y-auto py-2">
        <NavItem
          to="/"
          label="任务管理"
          active={location.pathname === "/" || location.pathname.startsWith("/task/")}
          darkMode={darkMode}
        />
        <NavItem
          to="/settings"
          label="设置"
          active={location.pathname === "/settings"}
          darkMode={darkMode}
        />
      </div>

      {/* 底部固定区域 */}
      <div className={`p-3 border-t flex-shrink-0 ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`w-full px-3 py-2 text-sm rounded-md transition duration-200 ${
            darkMode
              ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
              : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
          }`}
          style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
        >
          {darkMode ? "☀️ 浅色模式" : "🌙 深色模式"}
        </button>
      </div>
    </nav>
  );
};

const NavItem = ({ to, label, active, darkMode }: { to: string; label: string; active: boolean; darkMode: boolean }) => (
  <Link
    to={to}
    className={`block mx-2 my-0.5 px-3 py-2 rounded-md text-sm transition duration-200 ${
      active
        ? darkMode
          ? "bg-gray-700 text-white"
          : "bg-gray-200 text-gray-900"
        : darkMode
        ? "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
        : "text-gray-600 hover:bg-gray-200"
    }`}
    style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
  >
    {label}
  </Link>
);

export default App;
