package models

import "gorm.io/gorm"

type Post struct {
    gorm.Model
    Content   string `gorm:"type:text" json:"content"`
    MediaType string `json:"media_type"` // "text", "image", "video", "audio"
    MediaURL  string `json:"media_url"`
    UserID    uint   `json:"user_id"`
    User      User   `gorm:"foreignKey:UserID" json:"user"`
}