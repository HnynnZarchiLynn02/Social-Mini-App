package models

import "gorm.io/gorm"
type Like struct {
	gorm.Model
	PostID uint `gorm:"uniqueIndex:idx_post_user_like" json:"post_id"`
	Post   Post `gorm:"foreignKey:PostID" json:"-"`
	UserID uint `gorm:"uniqueIndex:idx_post_user_like" json:"user_id"`
	User   User `gorm:"foreignKey:UserID" json:"user"`
}
