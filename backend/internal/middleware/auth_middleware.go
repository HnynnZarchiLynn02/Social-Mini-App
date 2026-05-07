package middleware

import (
    "net/http"
    "os"
    "strings"

    "github.com/gin-gonic/gin"
    "github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        
        authHeader := c.GetHeader("Authorization")
        if authHeader == "" {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Login ဝင်ရန် လိုအပ်ပါသည်"})
            c.Abort()
            return
        }

        
        tokenString := strings.Replace(authHeader, "Bearer ", "", 1)

       
        token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
            return []byte(os.Getenv("JWT_SECRET")), nil
        })

        if err != nil || !token.Valid {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "မှားယွင်းသော သို့မဟုတ် သက်တမ်းကုန်ဆုံးနေသော Token ဖြစ်သည်"})
            c.Abort()
            return
        }

       
        claims, ok := token.Claims.(jwt.MapClaims)
        if ok && token.Valid {
           
            userID := uint(claims["user_id"].(float64))
            c.Set("user_id", userID)
        }

        c.Next()
    }
}