package models

import "gorm.io/gorm"
type Comment struct {
	gorm.Model
	Content string `gorm:"type:text;not null" json:"content"`
	PostID  uint   `json:"post_id"`
	Post    Post   `gorm:"foreignKey:PostID" json:"-"`
	UserID  uint   `json:"user_id"`
	User    User   `gorm:"foreignKey:UserID" json:"user"`
}