package models

import "gorm.io/gorm"

type Post struct {
	gorm.Model
	Content   string `gorm:"type:text" json:"content"`
	MediaType string `json:"media_type"` // "text", "image", "video", "audio"
	MediaURL  string `json:"media_url"`
	UserID    uint   `json:"user_id"`
	User      User   `gorm:"foreignKey:UserID" json:"user"`

	Comments []Comment `gorm:"foreignKey:PostID" json:"comments"`
	Likes    []Like    `gorm:"foreignKey:PostID" json:"-"`

	LikeCount int64 `gorm:"-" json:"like_count"`
	IsLiked   bool  `gorm:"-" json:"is_liked"`
}

type Comment struct {
	gorm.Model
	Content string `gorm:"type:text;not null" json:"content"`
	PostID  uint   `json:"post_id"`
	Post    Post   `gorm:"foreignKey:PostID" json:"-"`
	UserID  uint   `json:"user_id"`
	User    User   `gorm:"foreignKey:UserID" json:"user"`
}

type Like struct {
	gorm.Model
	PostID uint `gorm:"uniqueIndex:idx_post_user_like" json:"post_id"`
	Post   Post `gorm:"foreignKey:PostID" json:"-"`
	UserID uint `gorm:"uniqueIndex:idx_post_user_like" json:"user_id"`
	User   User `gorm:"foreignKey:UserID" json:"user"`
}
