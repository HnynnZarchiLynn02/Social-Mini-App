package routes

import (
	"backend/internal/handlers"
	"github.com/gin-gonic/gin"
)


func SetupRoutes(r *gin.Engine) {
	r.POST("/register", handlers.RegisterUser)
	r.POST("/login", handlers.LoginUser) // ဒီစာကြောင်း အသစ်ထည့်ပါ
}