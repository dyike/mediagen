import React, { useState, useEffect } from "react";
import { GetConfig, UpdateConfig } from "../../wailsjs/go/main/App";

interface Config {
  openai_key: string;
  whisper_model: string;
  whisper_language: string;
}

const Settings: React.FC = () => {
  const [config, setConfig] = useState<Config>({
    openai_key: "",
    whisper_model: "medium",
    whisper_language: "zh",
  });

  const [status, setStatus] = useState<string>("");

  // 加载配置
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

  // 更新配置
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

  return (
    <div style={{ padding: "20px" }}>
      <h1>设置</h1>
      <div style={{ marginBottom: "20px" }}>
        <label>
          OpenAI 密钥:
          <input
            type="text"
            value={config.openai_key}
            onChange={(e) =>
              setConfig({ ...config, openai_key: e.target.value })
            }
            placeholder="输入 OpenAI 密钥"
          />
        </label>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <label>
          Whisper 模型:
          <select
            value={config.whisper_model}
            onChange={(e) =>
              setConfig({ ...config, whisper_model: e.target.value })
            }
          >
            <option value="tiny">Tiny</option>
            <option value="base">Base</option>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </label>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <label>
          Whisper 语言:
          <input
            type="text"
            value={config.whisper_language}
            onChange={(e) =>
              setConfig({ ...config, whisper_language: e.target.value })
            }
            placeholder="输入语言代码（如 zh, en）"
          />
        </label>
      </div>
      <button onClick={handleSave}>保存</button>
      <p>{status}</p>
    </div>
  );
};

export default Settings;