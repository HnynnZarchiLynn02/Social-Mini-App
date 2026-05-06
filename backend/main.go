package main

import (
    "backend/internal/database"
    "backend/internal/models"
    "backend/internal/routes"
    "github.com/gin-gonic/gin"
    "github.com/joho/godotenv"
)

func main() {
    // Load environment variables from .env
    godotenv.Load()

    // Initialize Database
    database.ConnectDB()
    database.DB.AutoMigrate(&models.User{})

    // Initialize Router
    r := gin.Default()

    // Setup Routes with CORS logic
    routes.SetupRoutes(r)

    // Start Server
    r.Run(":8080")
}