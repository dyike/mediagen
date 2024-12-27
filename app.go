package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"os/exec"
	"strings"

	config "github.com/dyike/mediagen/internal/Config"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx           context.Context
	configManager *config.ConfigManager
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{
		configManager: config.NewConfigManager(),
	}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	err := a.configManager.LoadConfig()
	if err != nil {
		runtime.LogErrorf(a.ctx, "Load config failed: %v", err)
	}
}

func (a *App) shutdown(ctx context.Context) {

}

func (a *App) GetConfig() (config.AppConfig, error) {
	return a.configManager.GetConfig(), nil
}

func (a *App) UpdateConfig(newConfig config.AppConfig) error {
	return a.configManager.UpdateConfig(newConfig)
}

func (a *App) DownloadVideo(url string) (string, error) {
	cmd := exec.Command("yt-dlp", "-f", "bestvideo+bestaudio/best", "-o", "./downloads/%(title)s.%(ext)s", url)
	output, err := cmd.CombinedOutput()
	if err != nil {
		return "", fmt.Errorf("下载失败: %v\n%s", err, string(output))
	}

	result := string(output)
	lines := strings.Split(result, "\n")
	for _, line := range lines {
		if strings.Contains(line, "Destination") {
			parts := strings.Split(line, ":")
			if len(parts) > 1 {
				return strings.TrimSpace(parts[1]), nil
			}
		}
	}

	return "", fmt.Errorf("未找到下载路径")
}

func (a *App) TranscribeAudio(audioPath string) (string, error) {
	cmd := exec.Command("whisper", audioPath, "--language", "zh", "--model", "medium", "--output_format", "txt")
	output, err := cmd.CombinedOutput()
	if err != nil {
		return "", fmt.Errorf("转录失败: %v\n%s", err, string(output))
	}

	resultPath := strings.Replace(audioPath, ".mp3", ".txt", 1)
	content, err := os.ReadFile(resultPath)
	if err != nil {
		return "", fmt.Errorf("读取转录结果失败: %v", err)
	}

	return string(content), nil
}

type ChatCompletionRequest struct {
	Model    string `json:"model"`
	Messages []struct {
		Role    string `json:"role"`
		Content string `json:"content"`
	} `json:"messages"`
}

type ChatCompletionResponse struct {
	Choices []struct {
		Message struct {
			Content string `json:"content"`
		} `json:"message"`
	} `json:"choices"`
}

func (a *App) OrganizeContent(content string) (string, error) {
	apiKey := "YOUR_OPENAI_API_KEY"
	url := "https://api.openai.com/v1/chat/completions"

	request := ChatCompletionRequest{
		Model: "gpt-4",
		Messages: []struct {
			Role    string `json:"role"`
			Content string `json:"content"`
		}{
			{Role: "user", Content: content},
		},
	}

	data, err := json.Marshal(request)
	if err != nil {
		return "", fmt.Errorf("JSON 编码失败: %v", err)
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(data))
	if err != nil {
		return "", fmt.Errorf("请求构造失败: %v", err)
	}

	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("请求失败: %v", err)
	}
	defer resp.Body.Close()

	var response ChatCompletionResponse
	err = json.NewDecoder(resp.Body).Decode(&response)
	if err != nil {
		return "", fmt.Errorf("解析响应失败: %v", err)
	}

	if len(response.Choices) > 0 {
		return response.Choices[0].Message.Content, nil
	}

	return "", fmt.Errorf("未获得有效响应")
}