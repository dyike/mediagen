package settings

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/dyike/mediagen/internal/model"
)

const (
	appConfigFile = "./data/app_config.json"
)

type SettingsRepo interface {
	InitAppConfig() error
	GetAppConfig() model.AppConfig
	UpdateAppConfig(newConfig model.AppConfig) error
}

type settingsImpl struct {
	config model.AppConfig
}

func NewSettingsRepo() SettingsRepo {
	return &settingsImpl{
		config: model.AppConfig{
			OpenAIKey:       "",
			WhisperModel:    "medium",
			WhisperLanguage: "zh",
			DownloadDir:     "",
		},
	}
}

func (s *settingsImpl) InitAppConfig() error {
	_, err := os.Stat(appConfigFile)
	if os.IsNotExist(err) {
		return s.saveAppConfig()
	}
	return nil
}

func (s *settingsImpl) GetAppConfig() model.AppConfig {
	loadAppConfig, err := s.loadAppConfig()
	if err != nil {
		return s.config
	}
	return loadAppConfig
}

func (s *settingsImpl) UpdateAppConfig(newConfig model.AppConfig) error {
	s.config = newConfig
	return s.saveAppConfig()
}

func (s *settingsImpl) saveAppConfig() error {
	file, err := os.Create(appConfigFile)
	if err != nil {
		return fmt.Errorf("save config file faild: %v", err)
	}
	defer file.Close()

	return json.NewEncoder(file).Encode(&s.config)
}

func (s *settingsImpl) loadAppConfig() (model.AppConfig, error) {
	file, err := os.Open(appConfigFile)
	if err != nil {
		return model.AppConfig{}, fmt.Errorf("load config file faild: %v", err)
	}
	defer file.Close()

	var config model.AppConfig
	err = json.NewDecoder(file).Decode(&config)
	if err != nil {
		return model.AppConfig{}, fmt.Errorf("decode config file faild: %v", err)
	}
	return config, nil
}
