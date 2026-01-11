package main

import (
	"embed"
	_ "embed"
	"log"

	"github.com/wailsapp/wails/v3/pkg/application"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create MediaService
	mediaService := NewMediaService()
	if mediaService == nil {
		log.Fatal("Failed to initialize MediaService")
	}

	// Create a new Wails application
	app := application.New(application.Options{
		Name:        "mediagen",
		Description: "视频转XHS文案生成器",
		Services: []application.Service{
			application.NewService(mediaService),
		},
		Assets: application.AssetOptions{
			Handler: application.AssetFileServerFS(assets),
		},
		Mac: application.MacOptions{
			ApplicationShouldTerminateAfterLastWindowClosed: true,
		},
	})

	// Set app reference in MediaService for dialogs
	mediaService.SetApp(app)

	// Create main window
	app.Window.NewWithOptions(application.WebviewWindowOptions{
		Title:  "视频转XHS文案生成器",
		Width:  1024,
		Height: 768,
		Mac: application.MacWindow{
			InvisibleTitleBarHeight: 50,
			Backdrop:                application.MacBackdropTranslucent,
			TitleBar:                application.MacTitleBarHiddenInset,
		},
		BackgroundColour: application.NewRGB(27, 38, 54),
		URL:              "/",
	})

	// Run the application
	err := app.Run()
	if err != nil {
		log.Fatal(err)
	}
}
