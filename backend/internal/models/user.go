package models

import "gorm.io/gorm"



type User struct {
    gorm.Model
    Username string `gorm:"unique;not null" json:"username"`
    Email    string `gorm:"unique;not null" json:"email"`
    Password string `gorm:"not null" json:"-"` // gorm:"type:text" ဆိုတာမျိုး မသုံးပါနဲ့
    Bio      string `json:"bio"`
    Avatar   string `json:"avatar"`
}