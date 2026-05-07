package handlers

import (
    "backend/internal/database"
    "backend/internal/models"
    "fmt"
    "net/http"
    "os"
    "path/filepath"
    "strings"
    "time"

    "github.com/gin-gonic/gin"
)

func CreatePost(c *gin.Context) {
    // 💡 အရေးကြီး: Multipart form ကို လက်ခံရန် memory limit သတ်မှတ်ပါ
    if err := c.Request.ParseMultipartForm(32 << 20); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "File too large"})
        return
    }

    val, _ := c.Get("user_id")
    userID := val.(uint)

    // 💡 PostForm ကို သုံးပြီး Content ကို ယူပါ
    content := strings.TrimSpace(c.PostForm("content"))
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
    var posts []models.Post
    // 💡 Preload("User") လုပ်မှ User နာမည်တွေ ပေါ်မှာပါ
    database.DB.Preload("User").Order("created_at desc").Find(&posts)
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
    newContent := strings.TrimSpace(c.PostForm("content"))
    if newContent != "" {
        post.Content = newContent
    }

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

    database.DB.Delete(&post)
    c.JSON(http.StatusOK, gin.H{"message": "Post deleted successfully"})
}