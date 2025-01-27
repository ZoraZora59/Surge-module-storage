package main

import (
	"encoding/json"
	"fmt"
	"log"
	"strconv"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

// Module 模型定义
type Module struct {
	ID          int32     `json:"id" gorm:"primaryKey"`
	Name        string    `json:"name"`
	Content     string    `json:"content"`
	Description string    `json:"description"`
	Category    string    `json:"category"`
	CreateTime  time.Time `json:"create_time" gorm:"type:datetime"`
	UpdateTime  time.Time `json:"update_time" gorm:"type:datetime"`
}

// MarshalJSON 自定义 JSON 序列化方法
func (m *Module) MarshalJSON() ([]byte, error) {
	type Alias Module
	return json.Marshal(&struct {
		*Alias
		CreateTime int64 `json:"create_time"`
		UpdateTime int64 `json:"update_time"`
	}{
		Alias:      (*Alias)(m),
		CreateTime: m.CreateTime.Unix(),
		UpdateTime: m.UpdateTime.Unix(),
	})
}

const (
	TIME_TOLERANCE = 600 // 允许的时间误差（秒）
)

var db *gorm.DB

func authMiddleware(cfg *Config) gin.HandlerFunc {
	token := cfg.AuthToken
	return func(c *gin.Context) {
		// 检查 API Key
		apiKey := c.GetHeader("X-API-Key")
		if apiKey != token {
			log.Printf("认证失败: 无效的 API Key: %s", apiKey)
			c.JSON(401, gin.H{"error": "认证失败"})
			c.Abort()
			return
		}

		// 检查时间戳
		timestamp := c.GetHeader("X-Timestamp")
		reqTime, err := strconv.ParseInt(timestamp, 10, 64)
		if err != nil {
			log.Printf("认证失败: 无效的时间戳格式: %s", timestamp)
			c.JSON(401, gin.H{"error": "认证失败"})
			c.Abort()
			return
		}

		// 检查时间是否在允许范围内
		now := time.Now().Unix()
		if abs(now-reqTime) > TIME_TOLERANCE {
			c.JSON(401, gin.H{"error": "时间戳已过期"})
			c.Abort()
			return
		}

		c.Next()
	}
}

func abs(n int64) int64 {
	if n < 0 {
		return -n
	}
	return n
}
func main() {
	// 加载配置
	config := loadConfig()

	// 连接数据库
	var err error
	db, err = gorm.Open(mysql.Open(config.GetDSN()), &gorm.Config{})
	if err != nil {
		log.Fatalf("连接数据库失败: %v", err)
	}

	// 创建Gin实例
	r := gin.Default()

	// 配置CORS中间件
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	r.GET("/subscribe/modules/:id", subscribeModule)
	// 设置API路由
	api := r.Group("/api")
	api.Use(authMiddleware(config)) // 添加鉴权中间件
	{
		// 获取所有模块
		api.GET("/modules", getModules)
		// 获取单个模块
		api.GET("/modules/:id", getModule)
		// 创建模块
		api.POST("/modules", createModule)
		// 更新模块
		api.PUT("/modules/:id", updateModule)
		// 删除模块
		api.DELETE("/modules/:id", deleteModule)
	}

	// 启动服务器
	if err := r.Run(":" + config.ServerPort); err != nil {
		log.Fatalf("启动服务器失败: %v", err)
	}
}

// 订阅处理函数
func subscribeModule(c *gin.Context) {
	id := c.Param("id")
	var module Module
	if err := db.First(&module, "id = ?", id).Error; err != nil {
		c.String(404, "Module not found")
		return
	}

	// 设置响应头，使其作为文件下载
	c.Header("Content-Disposition", "attachment; filename="+module.Name+".sgmodule")
	c.Header("Content-Type", "application/octet-stream")
	c.String(200, module.Content)
}

// 处理函数
func getModules(c *gin.Context) {
	var modules []Module
	if err := db.Find(&modules).Error; err != nil {
		c.JSON(500, gin.H{"error": fmt.Sprintf("获取模块列表失败: %v", err)})
		return
	}
	c.JSON(200, modules)
}

func getModule(c *gin.Context) {
	id := c.Param("id")
	var module Module
	if err := db.First(&module, "id = ?", id).Error; err != nil {
		c.JSON(404, gin.H{"error": "模块不存在"})
		return
	}

	type Alias Module
	response := struct {
		*Alias
		CreateTime int64 `json:"create_time"`
		UpdateTime int64 `json:"update_time"`
	}{
		Alias:      (*Alias)(&module),
		CreateTime: module.CreateTime.Unix(),
		UpdateTime: module.UpdateTime.Unix(),
	}

	c.JSON(200, response)
}

func createModule(c *gin.Context) {
	var module Module
	if err := c.ShouldBindJSON(&module); err != nil {
		c.JSON(400, gin.H{"error": fmt.Sprintf("无效的请求数据: %v", err)})
		return
	}

	module.CreateTime = time.Now()
	module.UpdateTime = time.Now()

	if err := db.Create(&module).Error; err != nil {
		c.JSON(500, gin.H{"error": fmt.Sprintf("创建模块失败: %v", err)})
		return
	}
	c.JSON(201, module)
}

func updateModule(c *gin.Context) {
	id := c.Param("id")
	var module Module
	if err := db.First(&module, "id = ?", id).Error; err != nil {
		c.JSON(404, gin.H{"error": "模块不存在"})
		return
	}

	if err := c.ShouldBindJSON(&module); err != nil {
		c.JSON(400, gin.H{"error": fmt.Sprintf("无效的请求数据: %v", err)})
		return
	}

	module.UpdateTime = time.Now()

	if err := db.Save(&module).Error; err != nil {
		c.JSON(500, gin.H{"error": fmt.Sprintf("更新模块失败: %v", err)})
		return
	}
	c.JSON(200, module)
}

func deleteModule(c *gin.Context) {
	id := c.Param("id")
	if err := db.Delete(&Module{}, "id = ?", id).Error; err != nil {
		c.JSON(500, gin.H{"error": fmt.Sprintf("删除模块失败: %v", err)})
		return
	}
	c.JSON(204, nil)
}
