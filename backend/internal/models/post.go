package models

import "gorm.io/gorm"

type Post struct {
    gorm.Model
    Content   string `gorm:"type:text;not null" json:"content"`
    UserID    uint   `json:"user_id"`
    User      User   `gorm:"foreignKey:UserID" json:"user"` // Creator အချက်အလက်ပါတစ်ခါတည်းယူရန်
}