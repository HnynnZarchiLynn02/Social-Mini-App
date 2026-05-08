package handlers

import (
	"backend/internal/database"
	"backend/internal/models"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"log"
)


func RegisterUser(c *gin.Context) {
	var input struct {
		Username string `json:"username" binding:"required"`
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required,min=6"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "အချက်အလက်များ ပြည့်စုံစွာထည့်ပါ (Password အနည်းဆုံး ၆ လုံး)"})
		return
	}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)

	user := models.User{
		Username: input.Username,
		Email:    input.Email,
		Password: string(hashedPassword),
	}

	if err := database.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Email သို့မဟုတ် Username ထပ်နေပါသည်"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Registration အောင်မြင်ပါသည်"})
}

// LoginUser - အကောင့်ဝင်ရန်
func LoginUser(c *gin.Context) {
	var input struct {
		Email    string `json:"email" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email နှင့် Password ထည့်ပါ"})
		return
	}

	var user models.User
	if err := database.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "အီးမေးလ် သို့မဟုတ် စကားဝှက် မှားယွင်းနေပါသည်"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "အီးမေးလ် သို့မဟုတ် စကားဝှက် မှားယွင်းနေပါသည်"})
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"exp":     time.Now().Add(time.Hour * 72).Unix(),
	})

	tokenString, _ := token.SignedString([]byte(os.Getenv("JWT_SECRET")))

	c.JSON(http.StatusOK, gin.H{
		"token":    tokenString,
		"id":       user.ID,
		"username": user.Username,
	})
}

// GetProfile - Profile ကြည့်ရန်
func GetProfile(c *gin.Context) {
	val, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Login ဝင်ရန် လိုအပ်ပါသည်"})
		return
	}

	userID, ok := val.(uint)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal User ID Error"})
		return
	}

	var user models.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "အသုံးပြုသူ မတွေ့ပါ"})
		return
	}

	c.JSON(http.StatusOK, user)
}

// 1. Profile အချက်အလက်များကို Update လုပ်ရန်
func UpdateProfile(c *gin.Context) {
	// Middleware မှ user_id ကို ယူခြင်း
	val, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized: Please login again"})
		return
	}
	userID := val.(uint)

	// Frontend မှ ပို့သော JSON ကို လက်ခံရန် Struct
	var input struct {
		Username string `json:"username"`
		Bio      string `json:"bio"`
		Avatar   string `json:"avatar"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input format"})
		return
	}

	// Database ထဲတွင် User ကို ရှာဖွေခြင်း
	var user models.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Update လုပ်မည့် Data ကို Map ဖြင့် သတ်မှတ်ခြင်း (GORM အမှားနည်းသောနည်းလမ်း)
	updates := map[string]interface{}{
		"username": input.Username,
		"bio":      input.Bio,
		"avatar":   input.Avatar,
	}

	// Database ကို Update လုပ်ခြင်း
	if err := database.DB.Model(&user).Updates(updates).Error; err != nil {
		log.Println("GORM Update Error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database update failed: " + err.Error()})
		return
	}

	// အောင်မြင်လျှင် updated user ကို ပြန်ပို့ခြင်း
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Profile updated successfully",
		"user":    user,
	})
}

// 2. ပုံတင်ခြင်း (Upload Photo) အတွက် Function
func UploadAvatar(c *gin.Context) {
	file, err := c.FormFile("avatar")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
		return
	}

	// ပုံအမည်ကို ထပ်မနေအောင် Timestamp ဖြင့် ပြောင်းပေးခြင်း
	filename := fmt.Sprintf("%d_%s", time.Now().Unix(), filepath.Base(file.Filename))
	savePath := filepath.Join("uploads", filename)

	// Folder ထဲသို့ သိမ်းခြင်း
	if err := c.SaveUploadedFile(file, savePath); err != nil {
		log.Println("Save File Error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}

	// Frontend သို့ ပုံ URL ပြန်ပို့ခြင်း
	// ဥပမာ- http://localhost:8080/uploads/12345_image.jpg
	fileURL := fmt.Sprintf("http://localhost:8080/uploads/%s", filename)
	c.JSON(http.StatusOK, gin.H{
		"url": fileURL,
	})
}
