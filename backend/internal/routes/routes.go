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

	
	r.Static("/uploads", "./uploads")

	
	protected := r.Group("/")
	protected.Use(middleware.AuthMiddleware())
	{
		// Profile Section
		protected.GET("/profile", handlers.GetProfile)
		protected.PUT("/profile", handlers.UpdateProfile)
		protected.POST("/upload", handlers.UploadAvatar)

		// Posts Section
		protected.GET("/posts", handlers.GetPosts)          

		protected.POST("/posts", handlers.CreatePost)       

		protected.PUT("/posts/:id", handlers.UpdatePost)    

		protected.DELETE("/posts/:id", handlers.DeletePost) 

		protected.POST("/posts/:id/like", handlers.ToggleLike)

		protected.POST("/comments", handlers.CreateComment)

		protected.POST("/posts/:id/comments", handlers.CreateComment)

		protected.PUT("/comments/:commentId", handlers.UpdateComment)

		protected.DELETE("/comments/:commentId", handlers.DeleteComment)

		protected.GET("/my-posts", handlers.GetUserPosts)
	}
}
