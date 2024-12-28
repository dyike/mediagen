package db

import (
	"os"

	"github.com/dyike/mediagen/internal/model"
	sl "gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

const (
	dbName = "./data/mediagen.db"
)

func InitDB() (*gorm.DB, error) {
	fileInfo, err := os.Stat(dbName)
	if os.IsNotExist(err) || fileInfo.IsDir() {
		os.MkdirAll("./data", os.ModePerm)
		os.Create(dbName)
	}
	db, err := gorm.Open(sl.Open(dbName), &gorm.Config{})
	if err != nil {
		return nil, err
	}
	db.AutoMigrate(&model.TaskPo{})
	return db, nil
}
