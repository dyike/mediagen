package model

import "code.byted.org/gopkg/rand"

type TaskPo struct {
	Id         int    `gorm:"column:id;primary_key;AUTO_INCREMENT" json:"id"`
	TaskId     string `gorm:"column:task" json:"task"`
	VideoUrl   string `gorm:"column:video_url" json:"video_url"`
	TaskStatus string `gorm:"column:task_status" json:"task_status"`
	CreatedAt  int64  `gorm:"column:created_at" json:"created_at"`
	UpdatedAt  int64  `gorm:"column:updated_at" json:"updated_at"`
}

const (
	TaskStatus_Init              = "init"
	TaskStatus_Downloading       = "downloading"
	TaskStatus_FFmpegProcessing  = "ffmpeg_processing"
	TaskStatus_WhisperTranlation = "whisper_translation"
	TaskStatus_AIProcessing      = "ai_processing"
	TaskStatus_Completed         = "completed"
)

func GenerateTaskId() string {
	return "task-" + GenerateRandomString(8)
}

func GenerateRandomString(length int) string {
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	b := make([]byte, length)
	for i := range b {
		b[i] = charset[rand.Intn(len(charset))]
	}
	return string(b)
}
