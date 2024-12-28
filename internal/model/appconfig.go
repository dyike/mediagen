package model

type AppConfig struct {
	OpenAIKey       string `json:"openai_key"`
	WhisperModel    string `json:"whisper_model"`
	WhisperLanguage string `json:"whisper_language"`
	DownloadDir     string `json:"download_dir"`
}
