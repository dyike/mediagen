import React, { useState, useEffect } from "react";
import { GetConfig, UpdateConfig } from "../../wailsjs/go/main/App";

interface Config {
  openai_key: string;
  whisper_model: string;
  whisper_language: string;
}

const configFields = [
  { key: "openai_key", label: "OpenAI 密钥", type: "text" },
  {
    key: "whisper_model",
    label: "Whisper 模型",
    type: "select",
    options: ["tiny", "base", "small", "medium", "large"],
  },
];

const Settings: React.FC = () => {
  const [config, setConfig] = useState<Config>({
    openai_key: "",
    whisper_model: "medium",
    whisper_language: "zh",
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
    } catch (err) {
      console.error("保存配置失败", err);
      setStatus("保存失败！");
    }
  };

  const handleChange = (key: string, value: string) => {
    setConfig({ ...config, [key]: value });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">设置</h2>
      {configFields.map((field) => (
        <div className="mb-4" key={field.key}>
          <label className="block text-sm font-medium text-gray-700">
            {field.label}:
          </label>
          {field.type === "text" ? (
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded mt-1"
              value={config[field.key as keyof Config]}
              onChange={(e) => handleChange(field.key, e.target.value)}
            />
          ) : (
            <select
              className="w-full p-2 border border-gray-300 rounded mt-1"
              value={config[field.key as keyof Config]}
              onChange={(e) => handleChange(field.key, e.target.value)}
            >
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}
        </div>
      ))}
      <button
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={handleSave}
      >
        保存
        <svg
          className={`ml-2 h-4 w-4 animate-spin ${
            status === "正在保存..." ? "" : "hidden"
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C4.477 0 0 4.477 0 10h4zm2 5.291A7.963 7.963 0 014 12H0c0 2.42.862 4.642 2.291 6.292l1.415-1.415z"
          ></path>
        </svg>
      </button>
      <p
        className={`mt-2 text-sm ${
          status === "保存成功！" ? "text-green-600" : "text-red-600"
        }`}
      >
        {status}
      </p>
    </div>
  );
};

export default Settings;