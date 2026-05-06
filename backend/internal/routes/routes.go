package routes

import (
    "backend/internal/handlers"
    "github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
    // CORS Middleware: Allows the frontend to communicate with this API
    r.Use(func(c *gin.Context) {
        c.Writer.Header().Set("Access-Control-Allow-Origin", "*") // In production, replace * with your frontend URL
        c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
        c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatus(204)
            return
        }
        c.Next()
    })

    // Auth Routes
    r.POST("/register", handlers.RegisterUser)
    r.POST("/login", handlers.LoginUser)
}