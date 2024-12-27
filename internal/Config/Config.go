package config

import (
	"encoding/json"
	"fmt"
	"os"
	"sync"
)

type AppConfig struct {
	OpenAIKey       string `json:"openai_key"`
	WhisperModel    string `json:"whisper_model"`
	WhisperLanguage string `json:"whisper_language"`
	DownloadDir     string `json:"download_dir"`
}

type ConfigManager struct {
	mu     sync.Mutex
	config AppConfig
}

func NewConfigManager() *ConfigManager {
	return &ConfigManager{
		config: AppConfig{
			OpenAIKey:       "",
			WhisperModel:    "medium",
			WhisperLanguage: "zh",
			DownloadDir:     "",
		},
	}
}

func (cm *ConfigManager) LoadConfig() error {
	cm.mu.Lock()
	defer cm.mu.Unlock()

	file, err := os.Open("config.json")
	if err != nil {
		if os.IsNotExist(err) {
			return cm.SaveConfig() // 如果配置文件不存在，创建默认配置
		}
		return fmt.Errorf("读取配置文件失败: %v", err)
	}
	defer file.Close()

	return json.NewDecoder(file).Decode(&cm.config)
}

func (cm *ConfigManager) SaveConfig() error {
	cm.mu.Lock()
	defer cm.mu.Unlock()

	file, err := os.Create("config.json")
	if err != nil {
		return fmt.Errorf("保存配置文件失败: %v", err)
	}
	defer file.Close()

	return json.NewEncoder(file).Encode(&cm.config)
}

func (cm *ConfigManager) GetConfig() AppConfig {
	cm.mu.Lock()
	defer cm.mu.Unlock()
	return cm.config
}

func (cm *ConfigManager) UpdateConfig(newConfig AppConfig) error {
	cm.mu.Lock()
	defer cm.mu.Unlock()

	cm.config = newConfig
	return cm.SaveConfig()
}
