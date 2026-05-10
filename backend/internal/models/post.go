package models

import "gorm.io/gorm"

type Post struct {
	gorm.Model
	Content   string `gorm:"type:text" json:"content"`
	MediaType string `json:"media_type"` 
	MediaURL  string `json:"media_url"`
	UserID    uint   `json:"user_id"`
	User      User   `gorm:"foreignKey:UserID" json:"user"`

	Comments []Comment `gorm:"foreignKey:PostID" json:"comments"`
	Likes    []Like    `gorm:"foreignKey:PostID" json:"-"`

	LikeCount int64 `gorm:"-" json:"like_count"`
	IsLiked   bool  `gorm:"-" json:"is_liked"`
}



