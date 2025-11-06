#!/bin/bash
# Gitee Pages 自动部署脚本

echo "📦 准备部署到 Gitee Pages..."

# 检查 build/web-mobile 目录是否存在
if [ ! -d "build/web-mobile" ]; then
    echo "❌ 错误：找不到 build/web-mobile 目录"
    echo "请先在 Cocos Creator 中构建项目！"
    exit 1
fi

echo "✅ 找到构建文件"

# 初始化 git（如果还没有）
if [ ! -d ".git" ]; then
    echo "🔧 初始化 Git 仓库..."
    git init
    git config user.name "你的名字"
    git config user.email "你的邮箱@example.com"
fi

# 添加所有文件
echo "📝 添加文件到 Git..."
git add .
git commit -m "更新游戏文件 - $(date '+%Y-%m-%d %H:%M:%S')"

# 推送到 Gitee（首次需要手动添加远程仓库）
echo "🚀 推送到 Gitee..."
git push -u origin master

echo ""
echo "✅ 部署完成！"
echo "📋 下一步："
echo "   1. 访问你的 Gitee 仓库"
echo "   2. 点击【服务】→【Gitee Pages】"
echo "   3. 选择部署分支：master"
echo "   4. 部署目录填写：build/web-mobile"
echo "   5. 点击【启动】按钮"
echo ""
echo "🌐 几分钟后就可以通过链接访问你的游戏了！"


