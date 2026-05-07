package handlers

import (
	"backend/internal/database"
	"backend/internal/models"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func postContentFromRequest(c *gin.Context) string {
	content := strings.TrimSpace(c.PostForm("content"))
	if content != "" {
		return content
	}

	var input struct {
		Content string `json:"content"`
	}
	if err := c.ShouldBindJSON(&input); err == nil {
		return strings.TrimSpace(input.Content)
	}

	return ""
}

func commentContentFromRequest(c *gin.Context) string {
	content := strings.TrimSpace(c.PostForm("content"))
	if content != "" {
		return content
	}

	var input struct {
		Content string `json:"content"`
	}
	if err := c.ShouldBindJSON(&input); err == nil {
		return strings.TrimSpace(input.Content)
	}

	return ""
}

func CreatePost(c *gin.Context) {
	// 💡 အရေးကြီး: Multipart form ကို လက်ခံရန် memory limit သတ်မှတ်ပါ
	val, _ := c.Get("user_id")
	userID := val.(uint)

	// 💡 PostForm ကို သုံးပြီး Content ကို ယူပါ
	content := postContentFromRequest(c)
	file, fileErr := c.FormFile("media")

	// စာရော ပုံရော မပါရင် error ပြမယ်
	if content == "" && fileErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Content is required"})
		return
	}

	mediaURL := ""
	mediaType := "text"

	if fileErr == nil {
		uploadDir := "uploads/posts"
		os.MkdirAll(uploadDir, os.ModePerm)

		ext := strings.ToLower(filepath.Ext(file.Filename))
		fileName := fmt.Sprintf("%d_%d%s", userID, time.Now().UnixNano(), ext)
		savePath := filepath.Join(uploadDir, fileName)

		if err := c.SaveUploadedFile(file, savePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
			return
		}

		mediaURL = "http://localhost:8080/" + filepath.ToSlash(savePath)

		if strings.Contains(".jpg.jpeg.png.gif.webp", ext) && ext != "" {
			mediaType = "image"
		} else if strings.Contains(".mp4.mov.avi.mkv", ext) && ext != "" {
			mediaType = "video"
		} else if strings.Contains(".mp3.wav.ogg", ext) && ext != "" {
			mediaType = "audio"
		}
	}

	post := models.Post{Content: content, MediaType: mediaType, MediaURL: mediaURL, UserID: userID}
	database.DB.Create(&post)
	database.DB.Preload("User").First(&post, post.ID)
	c.JSON(http.StatusCreated, post)
}

func GetPosts(c *gin.Context) {
	val, _ := c.Get("user_id")
	userID := val.(uint)

	var posts []models.Post
	// 💡 Preload("User") လုပ်မှ User နာမည်တွေ ပေါ်မှာပါ
	database.DB.Preload("User").Preload("Comments", func(db *gorm.DB) *gorm.DB {
		return db.Order("created_at asc")
	}).Preload("Comments.User").Order("created_at desc").Find(&posts)

	for i := range posts {
		database.DB.Model(&models.Like{}).Where("post_id = ?", posts[i].ID).Count(&posts[i].LikeCount)

		var userLike models.Like
		posts[i].IsLiked = database.DB.Where("post_id = ? AND user_id = ?", posts[i].ID, userID).First(&userLike).Error == nil
	}

	c.JSON(http.StatusOK, posts)
}

func UpdatePost(c *gin.Context) {
	postID := c.Param("id")
	val, _ := c.Get("user_id")
	userID := val.(uint)

	var post models.Post
	if err := database.DB.First(&post, postID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		return
	}

	if post.UserID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "You are not authorized to edit this post"})
		return
	}

	// 💡 Update လုပ်တဲ့အခါလည်း PostForm ကို သုံးပါ
	newContent := postContentFromRequest(c)
	if newContent == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Content is required"})
		return
	}

	post.Content = newContent
	database.DB.Save(&post)
	database.DB.Preload("User").First(&post, post.ID)
	c.JSON(http.StatusOK, post)
}

func DeletePost(c *gin.Context) {
	postID := c.Param("id")
	val, _ := c.Get("user_id")
	userID := val.(uint)

	var post models.Post
	if err := database.DB.First(&post, postID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		return
	}

	if post.UserID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "You are not authorized to delete this post"})
		return
	}

	database.DB.Select("Comments", "Likes").Delete(&post)
	c.JSON(http.StatusOK, gin.H{"message": "Post deleted successfully"})
}

func ToggleLike(c *gin.Context) {
	postID := c.Param("id")
	val, _ := c.Get("user_id")
	userID := val.(uint)

	var post models.Post
	if err := database.DB.First(&post, postID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		return
	}

	var like models.Like
	err := database.DB.Where("post_id = ? AND user_id = ?", post.ID, userID).First(&like).Error
	isLiked := false

	if err == nil {
		database.DB.Delete(&like)
	} else if err == gorm.ErrRecordNotFound {
		like = models.Like{PostID: post.ID, UserID: userID}
		if err := database.DB.Create(&like).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to like post"})
			return
		}
		isLiked = true
	} else {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update like"})
		return
	}

	var likeCount int64
	database.DB.Model(&models.Like{}).Where("post_id = ?", post.ID).Count(&likeCount)

	c.JSON(http.StatusOK, gin.H{
		"is_liked":   isLiked,
		"like_count": likeCount,
	})
}

func CreateComment(c *gin.Context) {
	val, _ := c.Get("user_id")
	userID := val.(uint)

	var input struct {
		PostID      uint   `json:"post_id"`
		PostIDCamel uint   `json:"postId"`
		Content     string `json:"content"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		input.Content = c.PostForm("content")
		if formPostID, parseErr := strconv.ParseUint(c.PostForm("post_id"), 10, 64); parseErr == nil {
			input.PostID = uint(formPostID)
		}
	}

	if input.PostID == 0 {
		input.PostID = input.PostIDCamel
	}

	routePostID := c.Param("id")
	if routePostID == "" {
		routePostID = c.Param("postId")
	}
	if routePostID != "" {
		var routePost models.Post
		if err := database.DB.Select("id").First(&routePost, routePostID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
			return
		}
		input.PostID = routePost.ID
	}

	input.Content = strings.TrimSpace(input.Content)
	if input.Content == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Comment is required"})
		return
	}
	if input.PostID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Post ID is required"})
		return
	}

	var post models.Post
	if err := database.DB.First(&post, input.PostID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		return
	}

	comment := models.Comment{
		Content: input.Content,
		PostID:  post.ID,
		UserID:  userID,
	}
	if err := database.DB.Create(&comment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create comment: " + err.Error()})
		return
	}

	database.DB.Preload("User").First(&comment, comment.ID)
	c.JSON(http.StatusCreated, comment)
}

func UpdateComment(c *gin.Context) {
	commentID := c.Param("commentId")
	val, _ := c.Get("user_id")
	userID := val.(uint)

	content := commentContentFromRequest(c)
	if content == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Comment is required"})
		return
	}

	var comment models.Comment
	if err := database.DB.First(&comment, commentID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Comment not found"})
		return
	}

	if comment.UserID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "You are not authorized to edit this comment"})
		return
	}

	comment.Content = content
	database.DB.Save(&comment)
	database.DB.Preload("User").First(&comment, comment.ID)
	c.JSON(http.StatusOK, comment)
}

func DeleteComment(c *gin.Context) {
	commentID := c.Param("commentId")
	val, _ := c.Get("user_id")
	userID := val.(uint)

	var comment models.Comment
	if err := database.DB.First(&comment, commentID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Comment not found"})
		return
	}

	if comment.UserID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "You are not authorized to delete this comment"})
		return
	}

	database.DB.Delete(&comment)
	c.JSON(http.StatusOK, gin.H{"message": "Comment deleted successfully"})
}
