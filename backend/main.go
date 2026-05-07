package main

import (
    "backend/internal/database"
    "backend/internal/models"
    "backend/internal/routes"
    "github.com/gin-gonic/gin"
    "github.com/joho/godotenv"
)

func main() {
    
    godotenv.Load()

    
    database.ConnectDB()
    database.DB.AutoMigrate(&models.User{})

    
    r := gin.Default()
    r.Static("/uploads", "./uploads")
    r.MaxMultipartMemory = 100 << 20
    routes.SetupRoutes(r)

    
    r.Run(":8080")
}