#!/bin/bash

BINARY_NAME=surge-module-storage
BUILD_DIR=bin

# 创建构建目录
mkdir -p $BUILD_DIR

# 交叉编译
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o $BUILD_DIR/$BINARY_NAME .

# 打包
cd $BUILD_DIR && tar czf $BINARY_NAME.tar.gz $BINARY_NAME