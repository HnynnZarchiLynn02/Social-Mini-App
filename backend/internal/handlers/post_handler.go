package handlers

import (
    "backend/internal/database"
    "backend/internal/models"
    "net/http"
    "github.com/gin-gonic/gin"
)

// Create Post
func CreatePost(c *gin.Context) {
    userID := c.MustGet("user_id").(uint)
    var input struct {
        Content string `json:"content" binding:"required"`
    }

    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Content is required"})
        return
    }

    post := models.Post{Content: input.Content, UserID: userID}
    database.DB.Create(&post)
    c.JSON(http.StatusCreated, post)
}

// View All Posts (Feed)
func GetPosts(c *gin.Context) {
    var posts []models.Post
    // Preload("User") သုံးခြင်းဖြင့် ပိုစ့်တင်သူနာမည်ပါ တစ်ခါတည်းပါလာမည်
    database.DB.Preload("User").Order("created_at desc").Find(&posts)
    c.JSON(http.StatusOK, posts)
}

// Edit Post (Owner Only)
func UpdatePost(c *gin.Context) {
    postID := c.Param("id")
    userID := c.MustGet("user_id").(uint)

    var post models.Post
    if err := database.DB.First(&post, postID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
        return
    }

    // Security Check: ပိုင်ရှင်ဟုတ်မဟုတ် စစ်ခြင်း
    if post.UserID != userID {
        c.JSON(http.StatusForbidden, gin.H{"error": "You cannot edit this post"})
        return
    }

    var input struct {
        Content string `json:"content"`
    }
    c.ShouldBindJSON(&input)

    database.DB.Model(&post).Update("content", input.Content)
    c.JSON(http.StatusOK, post)
}

// Delete Post (Owner Only)
func DeletePost(c *gin.Context) {
    postID := c.Param("id")
    userID := c.MustGet("user_id").(uint)

    var post models.Post
    if err := database.DB.First(&post, postID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
        return
    }

    if post.UserID != userID {
        c.JSON(http.StatusForbidden, gin.H{"error": "You cannot delete this post"})
        return
    }

    database.DB.Delete(&post)
    c.JSON(http.StatusOK, gin.H{"message": "Post deleted successfully"})
}