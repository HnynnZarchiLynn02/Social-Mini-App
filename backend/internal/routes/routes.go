package routes

import (
	"backend/internal/handlers"
	"backend/internal/middleware"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	// --- CORS Middleware ---
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

	// --- Public Routes ---
	r.POST("/register", handlers.RegisterUser)
	r.POST("/login", handlers.LoginUser)

	
	r.Static("/uploads", "./uploads")

	// --- Protected Routes (Login  only) ---
	protected := r.Group("/")
	protected.Use(middleware.AuthMiddleware())
	{
		// Profile Section
		protected.GET("/profile", handlers.GetProfile)
		protected.PUT("/profile", handlers.UpdateProfile)
		protected.POST("/upload", handlers.UploadAvatar)

		// Posts Section
		protected.GET("/posts", handlers.GetPosts)          // Feed မှာ ပိုစ့်များ ကြည့်ရန်
		protected.POST("/posts", handlers.CreatePost)       // ပိုစ့်အသစ် တင်ရန်
		protected.PUT("/posts/:id", handlers.UpdatePost)    // မိမိပိုစ့်ကို ပြန်ပြင်ရန်
		protected.DELETE("/posts/:id", handlers.DeletePost) // မိမိပိုစ့်ကို ဖျက်ရန်
		protected.POST("/posts/:id/like", handlers.ToggleLike)
		protected.POST("/comments", handlers.CreateComment)
		protected.POST("/posts/:id/comments", handlers.CreateComment)
		protected.PUT("/comments/:commentId", handlers.UpdateComment)
		protected.DELETE("/comments/:commentId", handlers.DeleteComment)
	}
}
