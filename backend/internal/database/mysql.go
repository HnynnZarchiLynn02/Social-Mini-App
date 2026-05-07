package database

import (
	"backend/internal/models" // သင့် Project Path အမှန်ကို စစ်ဆေးပါ
	"fmt"
	"log"
	"os"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	user := os.Getenv("DB_USER")
	pass := os.Getenv("DB_PASS")
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	name := os.Getenv("DB_NAME")

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		user, pass, host, port, name)

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Database connection error: %v", err)
	}

	// --- ဒီအပိုင်းကို ထည့်လိုက်ခြင်းဖြင့် Column အသစ်တွေ (Bio, Avatar) ပေါ်လာပါလိမ့်မယ် ---
	fmt.Println("Migrating database models...")
	if err := db.AutoMigrate(&models.User{}); err != nil {
		log.Printf("User migration error: %v", err)
	}

	if err := db.AutoMigrate(&models.Post{}, &models.Comment{}, &models.Like{}); err != nil {
		log.Printf("Post/comment/like migration error: %v", err)
	}

	fmt.Println("Database Connection and Migration Successful!")
	DB = db
}
