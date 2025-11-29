#!/bin/bash

echo "🧹 清理项目并重新构建..."

# 删除问题文件
rm -rf node_modules package-lock.json .next

# 清理所有缓存
npm cache clean --force

# 重新安装依赖
npm install

# 重新生成Prisma客户端
npm run db:generate

# 推送数据库
npm run db:push

echo "✅ 项目清理完成！"
echo "🚀 启动开发服务器..."
npm run dev