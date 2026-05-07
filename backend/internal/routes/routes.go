package routes

import (
    "backend/internal/handlers"
    "backend/internal/middleware"
    "github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
    
    r.Use(func(c *gin.Context) {
        c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
        c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
        c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatus(204)
            return
        }
        c.Next()
    })

    
    r.POST("/register", handlers.RegisterUser)
    r.POST("/login", handlers.LoginUser)

    
    protected := r.Group("/")
    protected.Use(middleware.AuthMiddleware())
    {
        protected.GET("/profile", handlers.GetProfile)
        protected.PUT("/profile", handlers.UpdateProfile)
    }
}