import React, { useState, useEffect } from "react";
import { MediaService } from "../../bindings/github.com/dyike/mediagen";

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
        const result = await MediaService.GetConfig();
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
      await MediaService.UpdateConfig(config);
      setStatus("保存成功！");
      setTimeout(() => setStatus(""), 3000);
    } catch (err) {
      console.error("保存配置失败", err);
      setStatus("保存失败！");
      setTimeout(() => setStatus(""), 3000);
    }
  };

  const handleChange = (key: string, value: string) => {
    setConfig({ ...config, [key]: value });
  };

  const handleSelectFolder = async () => {
    try {
      const folderPath = await MediaService.OpenDownloadDir();
      if (folderPath) {
        setConfig({ ...config, download_dir: folderPath });
      } else {
        console.log("未选择文件夹");
      }
    } catch (err) {
      console.error("选择文件夹失败", err);
    }
  };

  return (
    <div className="p-6 max-w-xl">

      {/* OpenAI Key */}
      <div className="mb-5">
        <label className="block text-sm font-medium mb-2">
          OpenAI 密钥
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={config.openai_key}
          onChange={(e) => handleChange("openai_key", e.target.value)}
          placeholder="请输入 OpenAI 密钥"
        />
      </div>

      {/* Whisper Model */}
      <div className="mb-5">
        <label className="block text-sm font-medium mb-2">
          Whisper 模型
        </label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={config.whisper_model}
          onChange={(e) => handleChange("whisper_model", e.target.value)}
        >
          {["tiny", "base", "small", "medium", "large"].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Download Path */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          视频下载路径
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
            value={config.download_dir}
            readOnly
          />
          <button
            onClick={handleSelectFolder}
            className="px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none"
          >
            选择
          </button>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full px-4 py-2 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 focus:outline-none"
      >
        保存
      </button>

      {/* Status Message */}
      {status && (
        <p
          className={`mt-3 text-sm text-center ${
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
