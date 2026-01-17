import { useState, createContext, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { MediaService } from "../bindings/github.com/dyike/mediagen";
import TaskManager from "./components/TaskManager";
import TaskDetails from "./components/TaskDetails";
import Settings from "./components/Settings";

// 创建任务的 Context
const NewTaskContext = createContext<{ triggerNewTask: () => void; newTaskTrigger: number }>({
  triggerNewTask: () => { },
  newTaskTrigger: 0,
});

export const useNewTask = () => useContext(NewTaskContext);

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [newTaskTrigger, setNewTaskTrigger] = useState(0);

  const triggerNewTask = () => {
    setNewTaskTrigger((prev) => prev + 1);
  };

  return (
    <NewTaskContext.Provider value={{ triggerNewTask, newTaskTrigger }}>
      <Router>
        <AppContent
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          triggerNewTask={triggerNewTask}
        />
      </Router>
    </NewTaskContext.Provider>
  );
};

const AppContent = ({
  darkMode,
  setDarkMode,
  sidebarCollapsed,
  setSidebarCollapsed,
  triggerNewTask,
}: {
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  triggerNewTask: () => void;
}) => {
  const location = useLocation();
  const isSettingsWindow = location.pathname === "/settings";

  if (isSettingsWindow) {
    return (
      <div className={`h-screen flex flex-col ${darkMode ? "dark" : ""}`}>
        <main className={`flex-1 overflow-auto ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}>
          <Settings />
        </main>
      </div>
    );
  }

  return (
    <div className={`h-screen flex flex-col ${darkMode ? "dark" : ""}`}>
      {/* 顶部标题栏 - 横跨整个窗口 */}
      <TitleBar
        darkMode={darkMode}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        onNewTask={triggerNewTask}
      />

      {/* 下方主体区域 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧导航栏 */}
        <Sidebar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          collapsed={sidebarCollapsed}
        />

        {/* 右侧内容区域 */}
        <main className={`flex-1 overflow-auto ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}>
          <Routes>
            <Route path="/" element={<TaskManager />} />
            <Route path="/task/:id" element={<TaskDetails />} />
            {/* Settings route handled separately above */}
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const TitleBar = ({
  darkMode,
  collapsed,
  setCollapsed,
  onNewTask,
}: {
  darkMode: boolean;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  onNewTask: () => void;
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getTitle = () => {
    if (location.pathname === "/") return "任务管理";
    if (location.pathname === "/settings") return "设置";
    if (location.pathname.startsWith("/task/")) return "任务详情";
    return "";
  };

  const handleNewTask = () => {
    navigate("/");
    onNewTask();
  };

  return (
    <header
      className={`h-14 flex items-center border-b flex-shrink-0 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200"
        }`}
      style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
    >
      {/* 左侧：交通灯占位 + 按钮 */}
      <div className="flex items-center">
        {/* 交通灯占位 */}
        <div className="w-[70px] flex-shrink-0"></div>

        {/* 展开/收起按钮 */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`ml-6 mt-0 p-1.5 rounded-md transition-colors ${darkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-200 text-gray-500"
            }`}
          style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
          title={collapsed ? "显示侧边栏" : "隐藏侧边栏"}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z" />
          </svg>
        </button>

        {/* 新建任务按钮 */}
        <button
          onClick={handleNewTask}
          className={`ml-1 p-1.5 rounded-md transition-colors ${darkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-200 text-gray-500"
            }`}
          style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
          title="新建任务"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      </div>

      {/* 中间：标题 */}
      <div className={`ml-4 font-medium text-sm ${darkMode ? "text-gray-100" : "text-gray-700"}`}>
        {getTitle()}
      </div>

      {/* 右侧占位 */}
      <div className="flex-1"></div>
    </header>
  );
};

const Sidebar = ({
  darkMode,
  setDarkMode,
  collapsed,
}: {
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
  collapsed: boolean;
}) => {
  const location = useLocation();

  // 折叠时完全隐藏
  if (collapsed) {
    return null;
  }

  return (
    <nav
      className={`w-56 transition-all duration-300 flex flex-col border-r flex-shrink-0 ${darkMode ? "bg-gray-900 border-gray-700" : "bg-gray-100 border-gray-200"
        }`}
    >
      {/* 导航菜单 - 可滚动 */}
      <div className="flex-1 overflow-y-auto py-2">
        <NavItem
          to="/"
          label="任务管理"
          active={location.pathname === "/" || location.pathname.startsWith("/task/")}
          darkMode={darkMode}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          }
        />
        <div onClick={(e) => {
          e.preventDefault();
          MediaService.OpenSettingsWindow();
        }}>
          <NavItem
            to="#" // Dummy link
            label="设置"
            active={location.pathname === "/settings"}
            darkMode={darkMode}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />
        </div>
      </div>

      {/* 底部固定区域 */}
      <div className={`p-2 border-t flex-shrink-0 ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`w-full px-2 py-2 text-sm rounded-md transition duration-200 flex items-center ${darkMode
              ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
              : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
          title={darkMode ? "浅色模式" : "深色模式"}
        >
          <span>{darkMode ? "☀️" : "🌙"}</span>
          <span className="ml-2">{darkMode ? "浅色模式" : "深色模式"}</span>
        </button>
      </div>
    </nav>
  );
};

const NavItem = ({
  to,
  label,
  active,
  darkMode,
  icon,
}: {
  to: string;
  label: string;
  active: boolean;
  darkMode: boolean;
  icon: React.ReactNode;
}) => (
  <Link
    to={to}
    className={`flex items-center mx-2 my-0.5 px-3 py-2 rounded-md text-sm transition duration-200 ${active
        ? darkMode
          ? "bg-gray-700 text-white"
          : "bg-gray-200 text-gray-900"
        : darkMode
          ? "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
          : "text-gray-600 hover:bg-gray-200"
      }`}
    style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
  >
    {icon}
    <span className="ml-2">{label}</span>
  </Link>
);

export default App;
