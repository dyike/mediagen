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
	"time"

	"github.com/dyike/mediagen/internal/db"
	"github.com/dyike/mediagen/internal/model"
	"github.com/dyike/mediagen/internal/repo/settings"
	"github.com/dyike/mediagen/internal/repo/task"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx          context.Context
	settingsRepo settings.SettingsRepo
	taskRepo     task.TaskRepo
}

// NewApp creates a new App application struct
func NewApp() *App {
	db, err := db.InitDB()
	if err != nil {
		runtime.LogErrorf(context.Background(), "DB init failed: %v", err)
		return nil
	}
	return &App{
		settingsRepo: settings.NewSettingsRepo(),
		taskRepo:     task.NewTaskRepo(db),
	}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	err := a.settingsRepo.InitAppConfig()
	if err != nil {
		runtime.LogErrorf(a.ctx, "Load config failed: %v", err)
	}
}

func (a *App) shutdown(ctx context.Context) {

}

func (a *App) GetConfig() (model.AppConfig, error) {
	return a.settingsRepo.GetAppConfig(), nil
}

func (a *App) UpdateConfig(newConfig model.AppConfig) error {
	return a.settingsRepo.UpdateAppConfig(newConfig)
}

func (a *App) OpenDownloadDir() (string, error) {
	options := runtime.OpenDialogOptions{
		Title: "选择下载目录",
	}
	selectedDir, err := runtime.OpenDirectoryDialog(a.ctx, options)
	if err != nil {
		return "", fmt.Errorf("打开目录选择对话框失败: %v", err)
	}
	return selectedDir, nil
}

func (a *App) AddTask(videoUrl string) error {
	task := model.TaskPo{
		VideoUrl:   videoUrl,
		TaskId:     model.GenerateTaskId(),
		TaskStatus: model.TaskStatus_Init,
		CreatedAt:  time.Now().UnixMilli(),
		UpdatedAt:  time.Now().UnixMilli(),
	}
	return a.taskRepo.Create(&task)
}

func (a *App) GetTasks() ([]model.TaskPo, error) {
	return a.taskRepo.List()
}

func (a *App) DeleteTask(id int) error {
	return a.taskRepo.Delete(id)
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
