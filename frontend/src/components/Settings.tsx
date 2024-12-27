import React, { useState, useEffect } from "react";
import { GetConfig, UpdateConfig } from "../../wailsjs/go/main/App";

interface Config {
  openai_key: string;
  whisper_model: string;
  whisper_language: string;
  download_dir: string;
}

const Settings: React.FC = () => {
  const [config, setConfig] = useState<Config>({
    openai_key: "",
    whisper_model: "medium",
    whisper_language: "zh",
    download_dir: "",
  });

  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const result = await GetConfig();
        setConfig(result);
      } catch (err) {
        console.error("加载配置失败", err);
      }
    };
    fetchConfig();
  }, []);

  const handleSave = async () => {
    setStatus("正在保存...");
    try {
      await UpdateConfig(config);
      setStatus("保存成功！");
      setTimeout(() => setStatus(""), 3000); // 清除状态
    } catch (err) {
      console.error("保存配置失败", err);
      setStatus("保存失败！");
      setTimeout(() => setStatus(""), 3000); // 清除状态
    }
  };

  const handleChange = (key: string, value: string) => {
    setConfig({ ...config, [key]: value });
  };

  const handleSelectFolder = async () => {
    try {
      const selectedPath = await window.wails.FileDialog.OpenDialog({
        title: "选择下载路径",
        directory: true,
        multiple: false,
      });
      if (selectedPath) {
        setConfig({ ...config, download_dir: selectedPath });
      }
    } catch (err) {
      console.error("选择路径失败", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg transition duration-300">
      {/* Title */}
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
        设置
      </h2>

      {/* OpenAI Key */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3">
          OpenAI 密钥:
        </label>
        <input
          type="text"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={config.openai_key}
          onChange={(e) => handleChange("openai_key", e.target.value)}
          placeholder="请输入 OpenAI 密钥"
        />
      </div>

      {/* Whisper Model */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3">
          Whisper 模型:
        </label>
        <div className="relative">
          <select
            className="w-full px-4 py-3 appearance-none border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={config.whisper_model}
            onChange={(e) => handleChange("whisper_model", e.target.value)}
          >
            {["tiny", "base", "small", "medium", "large"].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400 dark:text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.707a1 1 0 011.414 0L10 11.414l3.293-3.707a1 1 0 011.414 0 .75.75 0 010 1.06l-4 4a1 1 0 01-1.414 0l-4-4a.75.75 0 010-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </div>
      </div>

      {/* Download Path */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3">
          视频下载路径:
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            className="flex-grow px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={config.download_dir}
            readOnly
          />
          <button
            onClick={handleSelectFolder}
            className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            选择路径
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="text-center">
        <button
          onClick={handleSave}
          className="w-full px-5 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 focus:ring-2 focus:ring-green-400 focus:outline-none"
        >
          保存
        </button>
      </div>

      {/* Status Message */}
      {status && (
        <p
          className={`mt-4 text-sm text-center ${
            status === "保存成功！" ? "text-green-600" : "text-red-600"
          }`}
        >
          {status}
        </p>
      )}
    </div>
  );
};

export default Settings;