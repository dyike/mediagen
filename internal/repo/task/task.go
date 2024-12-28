package task

import (
	"github.com/dyike/mediagen/internal/model"
	"gorm.io/gorm"
)

type TaskRepo interface {
	Create(task *model.TaskPo) error
	Delete(id int) error
	List() ([]model.TaskPo, error)
	Count() (int, error)
}

type taskImpl struct {
	db *gorm.DB
}

func NewTaskRepo(db *gorm.DB) TaskRepo {
	return &taskImpl{db: db}
}

func (t *taskImpl) Create(task *model.TaskPo) error {
	return t.db.Create(task).Error
}

func (t *taskImpl) Delete(id int) error {
	return t.db.Delete(&model.TaskPo{}, id).Error
}

func (t *taskImpl) List() ([]model.TaskPo, error) {
	var tasks []model.TaskPo
	err := t.db.Order("id desc").Find(&tasks).Error
	return tasks, err
}

func (t *taskImpl) Count() (int, error) {
	var count int64
	err := t.db.Model(&model.TaskPo{}).Count(&count).Error
	return int(count), err
}
