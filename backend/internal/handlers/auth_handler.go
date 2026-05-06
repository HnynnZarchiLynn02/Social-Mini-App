package handlers

import (
	"backend/internal/database"
	"backend/internal/models"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// RegisterUser - အကောင့်သစ်ဖွင့်ရန်
func RegisterUser(c *gin.Context) {
	// ၁။ Frontend ကလာမယ့် JSON data ပုံစံကို သတ်မှတ်တယ်
	var input struct {
		Username string `json:"username" binding:"required"`
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required,min=6"`
	}

	// ၂။ JSON ဒေတာကို စစ်ဆေးတယ် (Validation)
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "မှန်ကန်သော အချက်အလက်များ ထည့်ပါ (Password အနည်းဆုံး ၆ လုံး)"})
		return
	}

	// ၃။ Password ကို Hash (စာဝှက်) လုပ်တယ်
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Password စာဝှက်ခြင်း မအောင်မြင်ပါ"})
		return
	}

	// ၄။ User Object တည်ဆောက်တယ်
	user := models.User{
		Username: input.Username,
		Email:    input.Email,
		Password: string(hashedPassword),
	}

	// ၅။ Database ထဲမှာ သိမ်းတယ်
	if err := database.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User ဖန်တီး၍မရပါ (Email/Username ထပ်နေနိုင်သည်)"})
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

	// ၁။ DB ထဲမှာ အဆိုပါ Email ရှိမရှိ ရှာတယ်
	var user models.User
	if err := database.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "အီးမေးလ် သို့မဟုတ် စကားဝှက် မှားယွင်းနေပါသည်"})
		return
	}

	// ၂။ Password ကို တိုက်စစ်တယ်
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "အီးမေးလ် သို့မဟုတ် စကားဝှက် မှားယွင်းနေပါသည်"})
		return
	}

	// ၃။ JWT Token ထုတ်ပေးတယ်
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"exp":     time.Now().Add(time.Hour * 72).Unix(), // ၃ ရက် သက်တမ်း
	})

	// ၄။ .env ထဲက JWT_SECRET နဲ့ Token ကို Sign လုပ်တယ်
	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Token ထုတ်ပေးရန် အမှားအယွင်းရှိသည်"})
		return
	}

	// ၅။ Token နဲ့ Username ကို Response ပြန်ပို့တယ်
	c.JSON(http.StatusOK, gin.H{
		"token":    tokenString,
		"username": user.Username,
	})
}