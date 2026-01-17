package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/exec"
	"strings"
	"time"

	"github.com/dyike/mediagen/internal/db"
	"github.com/dyike/mediagen/internal/model"
	"github.com/dyike/mediagen/internal/repo/settings"
	"github.com/dyike/mediagen/internal/repo/task"
	"github.com/wailsapp/wails/v3/pkg/application"
	"github.com/wailsapp/wails/v3/pkg/events"
)

type MediaService struct {
	app            *application.App
	settingsRepo   settings.SettingsRepo
	taskRepo       task.TaskRepo
	settingsWindow *application.WebviewWindow
}

func NewMediaService() *MediaService {
	database, err := db.InitDB()
	if err != nil {
		log.Printf("DB init failed: %v", err)
		return nil
	}
	return &MediaService{
		settingsRepo: settings.NewSettingsRepo(),
		taskRepo:     task.NewTaskRepo(database),
	}
}

// SetApp sets the application instance (called from main after app creation)
func (m *MediaService) SetApp(app *application.App) {
	m.app = app
}

// OnStartup is called when the service starts
func (m *MediaService) OnStartup(ctx context.Context, options application.ServiceOptions) error {
	err := m.settingsRepo.InitAppConfig()
	if err != nil {
		log.Printf("Load config failed: %v", err)
	}
	return nil
}

func (m *MediaService) GetConfig() (model.AppConfig, error) {
	return m.settingsRepo.GetAppConfig(), nil
}

func (m *MediaService) UpdateConfig(newConfig model.AppConfig) error {
	return m.settingsRepo.UpdateAppConfig(newConfig)
}

func (m *MediaService) OpenSettingsWindow() {
	if m.app == nil {
		return
	}
	// 如果设置窗口已存在，直接激活它
	if m.settingsWindow != nil {
		m.settingsWindow.Focus()
		return
	}
	// 创建新的设置窗口
	m.settingsWindow = m.app.Window.NewWithOptions(application.WebviewWindowOptions{
		Title:     "设置",
		Width:     800,
		Height:    600,
		MinWidth:  800,
		MinHeight: 400,
		Mac: application.MacWindow{
			Backdrop:                application.MacBackdropTranslucent,
			TitleBar:                application.MacTitleBarHiddenInsetUnified,
			InvisibleTitleBarHeight: 48,
		},
		MinimiseButtonState: application.ButtonDisabled,
		MaximiseButtonState: application.ButtonDisabled,
		BackgroundColour:    application.NewRGB(245, 245, 247), // 匹配侧边栏背景色
		URL:                 "/settings",
	})
	// 监听窗口关闭事件，清除引用
	m.settingsWindow.OnWindowEvent(events.Common.WindowClosing, func(event *application.WindowEvent) {
		m.settingsWindow = nil
	})
}

func (m *MediaService) OpenDownloadDir() (string, error) {
	if m.app == nil {
		return "", fmt.Errorf("application not initialized")
	}
	selectedDir, err := m.app.Dialog.OpenFile().
		SetTitle("选择下载目录").
		CanChooseDirectories(true).
		CanChooseFiles(false).
		PromptForSingleSelection()
	if err != nil {
		return "", fmt.Errorf("打开目录选择对话框失败: %v", err)
	}
	return selectedDir, nil
}

func (m *MediaService) AddTask(videoUrl string) error {
	t := model.TaskPo{
		VideoUrl:   videoUrl,
		TaskId:     model.GenerateTaskId(),
		TaskStatus: model.TaskStatus_Init,
		CreatedAt:  time.Now().UnixMilli(),
		UpdatedAt:  time.Now().UnixMilli(),
	}
	return m.taskRepo.Create(&t)
}

func (m *MediaService) GetTasks() ([]model.TaskPo, error) {
	return m.taskRepo.List()
}

func (m *MediaService) DeleteTask(id int) error {
	return m.taskRepo.Delete(id)
}

func (m *MediaService) DownloadVideo(url string) (string, error) {
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

func (m *MediaService) TranscribeAudio(audioPath string) (string, error) {
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

func (m *MediaService) OrganizeContent(content string) (string, error) {
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
