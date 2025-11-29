#!/bin/bash

echo "🧹 重构项目以解决Next.js依赖问题..."

# 升级到Next.js稳定版本
npm install next@14.2.15

# 降级到兼容的React版本
npm install react@18 react-dom@18

# 重新安装依赖
npm install

# 重新生成Prisma客户端
npm run db:generate

echo "✅ 重构完成！"
echo "🚀 启动开发服务器..."
npm run dev