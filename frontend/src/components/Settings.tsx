import React, { useState } from "react";

type SettingTab = 'general' | 'appearance' | 'provider' | 'prompts' | 'mcp' | 'plugins' | 'advanced';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingTab>('general');
  const [language, setLanguage] = useState('简体中文');
  const [sendKey, setSendKey] = useState('Enter');
  const [iconPosition, setIconPosition] = useState('在 Dock 和 Menubar');
  const [autoHideDock, setAutoHideDock] = useState(false);
  const [autoScroll, setAutoScroll] = useState(false);
  const [proxy, setProxy] = useState('http://127.0.0.1:7897');

  const tabs = [
    {
      id: 'general' as SettingTab,
      name: '通用',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      )
    },
    {
      id: 'appearance' as SettingTab,
      name: '外观',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <circle cx="13.5" cy="6.5" r="2.5"></circle>
          <circle cx="17.5" cy="10.5" r="2.5"></circle>
          <circle cx="8.5" cy="7.5" r="2.5"></circle>
          <circle cx="6.5" cy="12.5" r="2.5"></circle>
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.688-1.688h1.913c1.935 0 3.626-1.69 3.626-3.625 0-3.875-3.25-8.75-8-8.75z"></path>
        </svg>
      )
    },
    {
      id: 'provider' as SettingTab,
      name: '提供商',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <rect x="2" y="2" width="20" height="20" rx="3"></rect>
          <path d="M12 7v5"></path>
          <path d="M12 17h.01"></path>
          <path d="M7 7h10"></path>
          <path d="M7 17h10"></path>
        </svg>
      )
    },
    {
      id: 'prompts' as SettingTab,
      name: '提示词',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
      )
    },
    {
      id: 'mcp' as SettingTab,
      name: 'MCP',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
        </svg>
      )
    },
    {
      id: 'plugins' as SettingTab,
      name: '插件',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <path d="M20.5 6c-2.61.7-5.67 1-8.5 1s-5.89-.3-8.5-1"></path>
          <path d="M20.8 13c-2.48-.6-5.18-.8-7.8-.8s-5.3.2-7.8.8"></path>
          <path d="M20.5 19c-2.61-.7-5.67-1-8.5-1s-5.89.3-8.5 1"></path>
          <path d="M6.5 2.4c1.88.9 4.38 1.4 6 1.4s4.12-.5 6-1.4"></path>
          <path d="M20.9 9.1a.7.7 0 0 1 .4.6v9.4a1 1 0 0 1-1.3.9c-2.9-1-6.2-1.5-9.5-1.5s-6.6.5-9.5 1.5a1 1 0 0 1-1.3-.9V9.7a.7.7 0 0 1 .4-.6c2.86-1 5.95-1.5 9-1.5s6.14.5 9 1.5z"></path>
        </svg>
      )
    },
    {
      id: 'advanced' as SettingTab,
      name: '高级',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M8 12h8"></path>
        </svg>
      )
    },
  ];

  return (
    <div className="flex h-screen bg-white"> {/* 主背景为白色 */}
      {/* 左侧边栏 - 作为一个整体从顶部到底部 */}
      <div
        className="w-[180px] flex-shrink-0 flex flex-col bg-[#F5F5F7] border-r border-gray-200/80"
        style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
      >
        {/* 交通灯占位区域 */}
        <div className="h-[52px] w-full flex-shrink-0" />

        {/* 菜单项 */}
        <div className="px-2 space-y-0.5" style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[13px] transition-colors ${activeTab === tab.id
                ? 'bg-[#007AFF]/10 text-[#007AFF] font-medium'
                : 'text-gray-600 hover:bg-gray-200/60'
                }`}
            >
              <span className={activeTab === tab.id ? 'text-[#007AFF]' : 'text-gray-500'}>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 右侧主内容区 */}
      <div className="flex-1 overflow-auto bg-[#FAFAFA]">
        {/* 标题区域 - 与交通灯对齐 */}
        <div className="h-[52px] px-8 flex items-center">
          <h1 className="text-[15px] font-semibold text-gray-800">
            {tabs.find(t => t.id === activeTab)?.name}
          </h1>
        </div>
        {/* 横线 - 延伸到左边界连接侧边栏 */}
        <hr className="border-gray-200 mt-3" />

        {/* 内容区域 */}
        <div className="w-full px-8 py-6">
          {activeTab === 'general' && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">

              {/* 界面语言 */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                <div className="text-[13px] font-medium text-gray-700">界面语言</div>
                <div className="relative">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded shadow-sm px-3 py-1 pr-8 text-[13px] text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 min-w-[120px]"
                  >
                    <option>简体中文</option>
                    <option>English</option>
                  </select>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-blue-500 bg-blue-500 rounded text-center" style={{ width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* 发送消息快捷键 */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                <div className="text-[13px] font-medium text-gray-700">发送消息快捷键</div>
                <div className="relative">
                  <select
                    value={sendKey}
                    onChange={(e) => setSendKey(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded shadow-sm px-3 py-1 pr-8 text-[13px] text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 min-w-[120px]"
                  >
                    <option>Enter</option>
                    <option>Cmd+Enter</option>
                    <option>Shift+Enter</option>
                  </select>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-blue-500 bg-blue-500 rounded text-center" style={{ width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* 应用图标位置 */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50/50">
                <div className="text-[13px] font-medium text-gray-700">应用图标位置</div>
                <div className="relative">
                  <select
                    value={iconPosition}
                    onChange={(e) => setIconPosition(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded shadow-sm px-3 py-1 pr-8 text-[13px] text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 min-w-[170px]"
                  >
                    <option>在 Dock 和 Menubar</option>
                    <option>仅在 Dock</option>
                  </select>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-blue-500 bg-blue-500 rounded text-center" style={{ width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* 自动隐藏 dock 图标 */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                <div className="text-[13px] font-medium text-gray-700">自动隐藏 dock 图标</div>
                <button
                  onClick={() => setAutoHideDock(!autoHideDock)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${autoHideDock ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${autoHideDock ? 'translate-x-5' : 'translate-x-0'
                      }`}
                  />
                </button>
              </div>

              {/* 聊天界面自动下滑 */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                <div>
                  <div className="text-[13px] font-medium text-gray-700">聊天界面自动下滑</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    在生成回复时自动滚动到聊天界面最底部
                  </div>
                </div>
                <button
                  onClick={() => setAutoScroll(!autoScroll)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${autoScroll ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${autoScroll ? 'translate-x-5' : 'translate-x-0'
                      }`}
                  />
                </button>
              </div>

              {/* 网络代理 */}
              <div className="flex items-center justify-between px-5 py-3">
                <div className="flex-1">
                  <div className="text-[13px] font-medium text-gray-700 pb-1">网络代理</div>
                  <div className="text-[11px] text-gray-500">
                    支持 HTTP 和 SOCKS5 代理，
                    <a href="#" className="underline">了解更多</a>
                  </div>
                </div>
                <div className="ml-4">
                  <input
                    type="text"
                    value={proxy}
                    onChange={(e) => setProxy(e.target.value)}
                    className="w-[180px] px-3 py-1 text-[13px] border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
                    placeholder="http://127.0.0.1:7897"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'general' && (
            <div className="text-gray-500 text-sm pl-1">此功能正在开发中...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
