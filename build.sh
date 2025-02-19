#!/bin/bash

# 设置错误时退出
set -e

echo "开始构建流程..."

# 清理旧的构建文件
if [ -d "dist" ]; then
    echo "清理旧的构建文件..."
    rm -rf dist
fi

# 检查pnpm是否安装
if ! command -v pnpm &> /dev/null; then
    echo "未检测到pnpm，正在安装..."
    npm install -g pnpm
fi

# 安装依赖
echo "安装项目依赖..."
pnpm install

# 构建生产环境版本
echo "构建生产环境版本..."
pnpm run build

echo "构建完成！生成的文件在 dist 目录中。"
