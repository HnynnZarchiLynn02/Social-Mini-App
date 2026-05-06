package main

import (
	"backend/internal/database"
	"backend/internal/models"
	"github.com/joho/godotenv"
	"github.com/gin-gonic/gin"
	

)
func main() {
	godotenv.Load()
	database.ConnectDB()
	database.DB.AutoMigrate(&models.User{})

	r := gin.Default()

	// Routes ချိတ်ဆက်ခြင်း
	routes.SetupRoutes(r)

	r.Run(":8080")
}