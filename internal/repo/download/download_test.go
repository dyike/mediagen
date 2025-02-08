package download

import "testing"

func TestDownload(t *testing.T) {
	downloader := NewDownloadRepo()
	videoUrl := "https://www.youtube.com/watch?v=6v2L2UGZJAM"
	downloader.GetVideoInfo(videoUrl)

}
