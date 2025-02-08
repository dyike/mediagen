package download

import (
	"fmt"

	"github.com/iawia002/lux/extractors"
	"github.com/iawia002/lux/request"
)

type DownloadRepo interface {
	GetVideoInfo(url string) (string, error)
	DownloadVideo(url string, dir string) error
}

type downloadImpl struct{}

func NewDownloadRepo() DownloadRepo {
	return &downloadImpl{}
}

func (d *downloadImpl) GetVideoInfo(url string) (string, error) {
	// 初始化全局 HTTP 请求配置，避免内部使用 nil 指针
	request.SetOptions(request.Options{
		RetryTimes: 3,     // 或者根据需要设置其他值
		UserAgent:  "lux", // 根据需要设置 User-Agent
		Debug:      false,
		Silent:     true,
		// Cookie、Refer 等可按需设置
	})

	data, err := extractors.Extract(url, extractors.Options{
		Playlist: false,
	})
	if err != nil {
		return "", fmt.Errorf("failed to extract video info: %w", err)
	}
	if len(data) == 0 {
		return "", fmt.Errorf("no video data extracted")
	}

	// e := json.NewEncoder(nil)
	// e.SetIndent("", "\t")
	// e.SetEscapeHTML(false)
	// if err := e.Encode(data); err != nil {
	// 	return "", err
	// }

	return "", nil
}

func (d *downloadImpl) DownloadVideo(url string, dir string) error {
	return nil
}
