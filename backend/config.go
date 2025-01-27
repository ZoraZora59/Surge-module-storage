package main

import (
	"fmt"
	"os"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	DBHost     string
	DBPort     string
	DBUser     string
	DBPassword string
	DBName     string
	ServerPort string
	AuthToken  string
}

var defaultConfig = Config{
	DBHost:     "localhost",
	DBPort:     "3306",
	DBUser:     "surgemdls",
	DBPassword: "example_password",
	DBName:     "surgemdls",
	ServerPort: "8080",
	AuthToken:  "example_token",
}

func loadConfig() *Config {
	// 加载.env文件
	if err := godotenv.Load(); err != nil {
		fmt.Printf("警告: .env文件未找到或无法加载: %v\n", err)
	}

	// 确定当前环境
	env := strings.ToUpper(os.Getenv("GO_ENV"))
	if env == "" {
		env = "DEV" // 默认使用开发环境
	}

	config := defaultConfig

	// 根据环境加载配置
	prefix := env + "_"
	if dbHost := os.Getenv(prefix + "DB_HOST"); dbHost != "" {
		config.DBHost = dbHost
	}
	if dbPort := os.Getenv(prefix + "DB_PORT"); dbPort != "" {
		config.DBPort = dbPort
	}
	if dbUser := os.Getenv(prefix + "DB_USER"); dbUser != "" {
		config.DBUser = dbUser
	}
	if dbPassword := os.Getenv(prefix + "DB_PASSWORD"); dbPassword != "" {
		config.DBPassword = dbPassword
	}
	if dbName := os.Getenv(prefix + "DB_NAME"); dbName != "" {
		config.DBName = dbName
	}
	if authToken := os.Getenv(prefix + "AUTH_TOKEN"); authToken != "" {
		config.AuthToken = authToken
	}
	if serverPort := os.Getenv(prefix + "SERVER_PORT"); serverPort != "" {
		config.ServerPort = serverPort
	}

	return &config
}

func (c *Config) GetDSN() string {
	return fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		c.DBUser, c.DBPassword, c.DBHost, c.DBPort, c.DBName)
}
func (c *Config) GetToken() string {
	return c.AuthToken
}
