# 部署指南

## 概述

本文档提供了 Felix 低代码平台的完整部署指南，包括开发环境、测试环境和生产环境的部署方案。

## 环境要求

### 基础环境

- **Node.js**: 18.0.0 或更高版本
- **包管理器**: pnpm (推荐) / npm / yarn
- **浏览器**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### 开发环境

```bash
# 检查 Node.js 版本
node --version  # >= 18.0.0

# 检查 pnpm 版本
pnpm --version  # >= 8.0.0

# 如果没有安装 pnpm
npm install -g pnpm
```

## 本地开发部署

### 1. 克隆项目

```bash
git clone https://github.com/your-username/felix-lowcode-platform.git
cd felix-lowcode-platform
```

### 2. 安装依赖

```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

### 3. 环境配置

创建环境变量文件：

```bash
# 复制环境变量模板
cp .env.example .env.local
```

编辑 `.env.local` 文件：

```env
# 应用配置
NEXT_PUBLIC_APP_NAME=Felix 低代码平台
NEXT_PUBLIC_APP_VERSION=0.1.0

# API 配置
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_WS_URL=ws://localhost:3000/ws

# 数据库配置 (可选)
DATABASE_URL=postgresql://username:password@localhost:5432/felix_db

# 认证配置 (可选)
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# 第三方服务配置 (可选)
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

### 4. 启动开发服务器

```bash
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 生产环境部署

### 方案一：Vercel 部署 (推荐)

#### 1. 准备部署

```bash
# 构建项目
pnpm build

# 测试生产构建
pnpm start
```

#### 2. 部署到 Vercel

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录 Vercel
vercel login

# 部署项目
vercel --prod
```

#### 3. 环境变量配置

在 Vercel 控制台中配置环境变量：

```env
NEXT_PUBLIC_APP_NAME=Felix 低代码平台
NEXT_PUBLIC_API_BASE_URL=https://your-domain.vercel.app/api
DATABASE_URL=your-production-database-url
NEXTAUTH_SECRET=your-production-secret
```

### 方案二：Docker 部署

#### 1. 创建 Dockerfile

```dockerfile
# 多阶段构建
FROM node:18-alpine AS base

# 安装依赖阶段
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 复制包管理文件
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# 构建阶段
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 构建应用
RUN corepack enable pnpm && pnpm build

# 运行阶段
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制构建产物
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### 2. 创建 docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_APP_NAME=Felix 低代码平台
      - DATABASE_URL=postgresql://postgres:password@db:5432/felix_db
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=felix_db
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    restart: unless-stopped

volumes:
  postgres_data:
```

#### 3. 部署命令

```bash
# 构建并启动服务
docker-compose up -d --build

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f app
```

### 方案三：传统服务器部署

#### 1. 服务器准备

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 pnpm
npm install -g pnpm

# 安装 PM2 (进程管理器)
npm install -g pm2
```

#### 2. 部署应用

```bash
# 克隆代码
git clone https://github.com/your-username/felix-lowcode-platform.git
cd felix-lowcode-platform

# 安装依赖
pnpm install

# 构建应用
pnpm build

# 创建 PM2 配置文件
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'felix-lowcode-platform',
    script: 'npm',
    args: 'start',
    cwd: '/path/to/felix-lowcode-platform',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF

# 启动应用
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### 3. Nginx 配置

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 静态资源缓存
    location /_next/static {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # 图片资源缓存
    location ~* \.(jpg|jpeg|png|gif|ico|svg)$ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000";
    }
}
```

## 数据库部署

### PostgreSQL 部署

#### 1. 安装 PostgreSQL

```bash
# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib

# CentOS/RHEL
sudo yum install postgresql-server postgresql-contrib

# 初始化数据库
sudo postgresql-setup initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### 2. 创建数据库和用户

```sql
-- 连接到 PostgreSQL
sudo -u postgres psql

-- 创建数据库
CREATE DATABASE felix_db;

-- 创建用户
CREATE USER felix_user WITH PASSWORD 'your_password';

-- 授权
GRANT ALL PRIVILEGES ON DATABASE felix_db TO felix_user;

-- 退出
\q
```

#### 3. 数据库迁移

```bash
# 安装数据库迁移工具
pnpm add -D prisma @prisma/client

# 初始化 Prisma
npx prisma init

# 运行迁移
npx prisma migrate deploy

# 生成客户端
npx prisma generate
```

### Redis 部署 (可选)

```bash
# 安装 Redis
sudo apt install redis-server

# 启动 Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server

# 测试连接
redis-cli ping
```

## 监控和日志

### 应用监控

#### 1. 健康检查端点

```typescript
// pages/api/health.ts
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const healthCheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    environment: process.env.NODE_ENV,
    version: process.env.NEXT_PUBLIC_APP_VERSION,
  };

  try {
    res.status(200).json(healthCheck);
  } catch (error) {
    healthCheck.message = 'Error';
    res.status(503).json(healthCheck);
  }
}
```

#### 2. PM2 监控

```bash
# 查看应用状态
pm2 status

# 查看日志
pm2 logs felix-lowcode-platform

# 监控面板
pm2 monit

# 重启应用
pm2 restart felix-lowcode-platform
```

### 日志管理

#### 1. 日志配置

```typescript
// lib/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export default logger;
```

#### 2. 日志轮转

```bash
# 安装 logrotate
sudo apt install logrotate

# 创建配置文件
sudo cat > /etc/logrotate.d/felix-lowcode << EOF
/path/to/felix-lowcode-platform/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 nodejs nodejs
    postrotate
        pm2 reloadLogs
    endscript
}
EOF
```

## 性能优化

### 构建优化

```javascript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 启用 SWC 压缩
  swcMinify: true,
  
  // 启用实验性功能
  experimental: {
    // 启用 App Router
    appDir: true,
    // 启用服务器组件
    serverComponents: true,
  },
  
  // 图片优化
  images: {
    domains: ['example.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // 压缩配置
  compress: true,
  
  // 输出配置
  output: 'standalone',
  
  // Webpack 配置
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // 客户端优化
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    return config;
  },
};

export default nextConfig;
```

### CDN 配置

```javascript
// next.config.mjs
const nextConfig = {
  assetPrefix: process.env.NODE_ENV === 'production' 
    ? 'https://cdn.your-domain.com' 
    : '',
  
  images: {
    loader: 'custom',
    loaderFile: './lib/image-loader.js',
  },
};
```

## 安全配置

### HTTPS 配置

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    
    add_header Strict-Transport-Security "max-age=63072000" always;
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    location / {
        proxy_pass http://localhost:3000;
        # ... 其他配置
    }
}

# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

### 环境变量安全

```bash
# 生产环境变量示例
NODE_ENV=production
NEXTAUTH_SECRET=$(openssl rand -base64 32)
DATABASE_URL=postgresql://user:$(openssl rand -base64 32)@localhost:5432/felix_db
```

## 备份和恢复

### 数据库备份

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="felix_db"
DB_USER="felix_user"

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份数据库
pg_dump -U $DB_USER -h localhost $DB_NAME > $BACKUP_DIR/felix_db_$DATE.sql

# 压缩备份文件
gzip $BACKUP_DIR/felix_db_$DATE.sql

# 删除 7 天前的备份
find $BACKUP_DIR -name "felix_db_*.sql.gz" -mtime +7 -delete

echo "Backup completed: felix_db_$DATE.sql.gz"
```

### 应用备份

```bash
#!/bin/bash
# app-backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
APP_DIR="/path/to/felix-lowcode-platform"
BACKUP_DIR="/backups/app"

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份应用文件
tar -czf $BACKUP_DIR/app_$DATE.tar.gz -C $APP_DIR .

# 删除 30 天前的备份
find $BACKUP_DIR -name "app_*.tar.gz" -mtime +30 -delete

echo "App backup completed: app_$DATE.tar.gz"
```

## 故障排除

### 常见问题

#### 1. 构建失败

```bash
# 清理缓存
pnpm clean
rm -rf .next node_modules
pnpm install
pnpm build
```

#### 2. 内存不足

```javascript
// package.json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
  }
}
```

#### 3. 端口占用

```bash
# 查找占用端口的进程
lsof -i :3000

# 杀死进程
kill -9 <PID>
```

### 日志分析

```bash
# 查看错误日志
tail -f logs/error.log

# 搜索特定错误
grep "ERROR" logs/combined.log

# 分析访问日志
awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -nr
```

## 更新和维护

### 应用更新

```bash
#!/bin/bash
# update.sh

# 备份当前版本
./backup.sh

# 拉取最新代码
git pull origin main

# 安装依赖
pnpm install

# 构建应用
pnpm build

# 重启应用
pm2 restart felix-lowcode-platform

echo "Update completed"
```

### 依赖更新

```bash
# 检查过期依赖
pnpm outdated

# 更新依赖
pnpm update

# 安全审计
pnpm audit
pnpm audit fix
```