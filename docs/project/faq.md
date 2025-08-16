# 常见问题解答 (FAQ)

## 目录

1. [安装和环境](#安装和环境)
2. [基础使用](#基础使用)
3. [组件相关](#组件相关)
4. [数据绑定](#数据绑定)
5. [样式和主题](#样式和主题)
6. [性能问题](#性能问题)
7. [部署相关](#部署相关)
8. [故障排除](#故障排除)

## 安装和环境

### Q: 支持哪些操作系统？

**A:** Felix 低代码平台支持以下操作系统：
- Windows 10 及以上版本
- macOS 10.15 (Catalina) 及以上版本
- Linux (Ubuntu 18.04+, CentOS 7+, Debian 10+)

### Q: Node.js 版本要求是什么？

**A:** 需要 Node.js 18.0.0 或更高版本。推荐使用最新的 LTS 版本。

```bash
# 检查 Node.js 版本
node --version

# 如果版本过低，建议使用 nvm 升级
nvm install 18
nvm use 18
```

### Q: 为什么推荐使用 pnpm？

**A:** pnpm 相比 npm 和 yarn 有以下优势：
- **更快的安装速度**: 使用硬链接和符号链接
- **更少的磁盘空间**: 避免重复安装相同的包
- **更严格的依赖管理**: 避免幽灵依赖问题

### Q: 安装依赖时出现权限错误怎么办？

**A:** 
```bash
# 方法1: 使用 sudo (不推荐)
sudo npm install

# 方法2: 配置 npm 全局目录 (推荐)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# 方法3: 使用 nvm 管理 Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

### Q: 在公司网络环境下安装失败怎么办？

**A:** 可能是代理或防火墙问题：

```bash
# 配置 npm 代理
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080

# 或使用国内镜像
npm config set registry https://registry.npmmirror.com/

# 使用 pnpm 配置镜像
pnpm config set registry https://registry.npmmirror.com/
```

## 基础使用

### Q: 第一次打开页面是空白的，怎么办？

**A:** 请检查以下几点：
1. 确认开发服务器已正常启动
2. 检查浏览器控制台是否有错误信息
3. 尝试刷新页面或清除浏览器缓存
4. 确认防火墙没有阻止 3000 端口

### Q: 如何保存我的项目？

**A:** Felix 提供多种保存方式：
- **自动保存**: 系统每 30 秒自动保存到本地存储
- **手动保存**: 使用 Ctrl+S 或点击保存按钮
- **导出项目**: 将项目导出为 .felix 文件
- **导出代码**: 生成可部署的代码包

### Q: 项目数据存储在哪里？

**A:** 
- **开发模式**: 数据存储在浏览器的 LocalStorage 中
- **生产模式**: 可配置存储到服务器数据库
- **导出文件**: 可保存为本地文件进行备份

### Q: 如何撤销误操作？

**A:** 
```
撤销: Ctrl+Z 或点击工具栏撤销按钮
重做: Ctrl+Y 或点击工具栏重做按钮
```

Felix 支持多级撤销，默认保存最近 50 步操作历史。

### Q: 支持哪些浏览器？

**A:** 推荐使用以下浏览器的最新版本：
- **Chrome 90+** (推荐)
- **Firefox 88+**
- **Safari 14+**
- **Edge 90+**

不支持 Internet Explorer。

## 组件相关

### Q: 为什么拖拽组件没有反应？

**A:** 可能的原因和解决方案：

1. **浏览器兼容性问题**
   ```javascript
   // 检查浏览器是否支持拖拽 API
   if (!('draggable' in document.createElement('div'))) {
     console.log('浏览器不支持拖拽功能');
   }
   ```

2. **目标容器不允许放置**
   - 确保拖拽到容器组件内部
   - 检查容器是否设置了 `allowDrop: false`

3. **组件被锁定**
   - 检查组件是否在图层面板中被锁定
   - 解锁后重试

### Q: 如何创建自定义组件？

**A:** 
1. **方法一: 通过界面创建**
   - 选择多个组件进行分组
   - 右键选择 "保存为组件"
   - 输入组件名称和描述

2. **方法二: 代码方式创建**
   ```typescript
   import { ComponentDefinition } from '@/types';
   
   const MyComponent: ComponentDefinition = {
     id: 'my-component',
     name: 'MyComponent',
     displayName: '我的组件',
     // ... 其他配置
   };
   ```

### Q: 组件属性修改后没有生效？

**A:** 请检查：
1. **属性绑定是否正确**
   - 确认属性值格式正确
   - 检查数据绑定路径是否存在

2. **组件是否支持该属性**
   - 查看组件文档确认支持的属性
   - 检查属性名称拼写是否正确

3. **缓存问题**
   - 尝试刷新页面
   - 清除浏览器缓存

### Q: 如何调整组件层级？

**A:** 
- **图层面板**: 在右侧图层面板中拖拽调整
- **右键菜单**: 选择 "置于顶层" 或 "置于底层"
- **快捷键**: 
  - Ctrl+] : 上移一层
  - Ctrl+[ : 下移一层

### Q: 组件选择困难怎么办？

**A:** 
- **图层面板选择**: 在图层面板中点击组件名称
- **框选**: 拖拽框选多个组件
- **穿透选择**: 按住 Ctrl 键点击可穿透选择下层组件

## 数据绑定

### Q: 数据绑定后组件不显示内容？

**A:** 常见问题排查：

1. **数据源连接问题**
   ```javascript
   // 检查数据源状态
   console.log('数据源状态:', dataSource.status);
   console.log('数据内容:', dataSource.data);
   ```

2. **字段路径错误**
   ```javascript
   // 正确的字段路径示例
   "user.profile.name"  // 对象嵌套
   "users[0].name"      // 数组索引
   "items.*.title"      // 通配符
   ```

3. **数据格式不匹配**
   - 确认数据类型与组件期望的类型一致
   - 检查是否需要数据转换

### Q: API 数据源请求失败？

**A:** 
1. **网络问题**
   - 检查网络连接
   - 确认 API 地址正确
   - 检查跨域设置

2. **认证问题**
   ```javascript
   // 检查请求头配置
   {
     "headers": {
       "Authorization": "Bearer your-token",
       "Content-Type": "application/json"
     }
   }
   ```

3. **请求参数问题**
   - 确认请求方法 (GET/POST/PUT/DELETE)
   - 检查参数格式和必填字段

### Q: 如何实现数据的实时更新？

**A:** 
1. **WebSocket 连接**
   ```javascript
   {
     "type": "realtime",
     "config": {
       "endpoint": "ws://localhost:8080/ws",
       "protocol": "websocket"
     }
   }
   ```

2. **轮询更新**
   ```javascript
   {
     "type": "api",
     "config": {
       "url": "/api/data",
       "polling": {
         "enabled": true,
         "interval": 5000  // 5秒轮询
       }
     }
   }
   ```

3. **Server-Sent Events**
   ```javascript
   {
     "type": "realtime",
     "config": {
       "endpoint": "/api/events",
       "protocol": "sse"
     }
   }
   ```

### Q: 数据转换不生效？

**A:** 
1. **转换函数语法错误**
   ```javascript
   // 正确的转换函数示例
   function transform(data) {
     return data.map(item => ({
       ...item,
       displayName: `${item.firstName} ${item.lastName}`
     }));
   }
   ```

2. **转换时机问题**
   - 确认转换在数据获取之后执行
   - 检查转换函数的执行顺序

## 样式和主题

### Q: 自定义样式不生效？

**A:** 
1. **CSS 优先级问题**
   ```css
   /* 使用更高优先级的选择器 */
   .my-component.custom-style {
     color: red !important;
   }
   ```

2. **样式作用域问题**
   - 确认样式是否被 CSS Modules 隔离
   - 检查样式类名是否正确应用

3. **主题覆盖问题**
   - 主题样式可能覆盖了自定义样式
   - 在主题编辑器中调整相关样式

### Q: 响应式样式不工作？

**A:** 
1. **断点配置检查**
   ```javascript
   // 确认断点配置正确
   {
     "mobile": "< 768px",
     "tablet": "768px - 1024px", 
     "desktop": "> 1024px"
   }
   ```

2. **媒体查询语法**
   ```css
   @media (max-width: 768px) {
     .component {
       width: 100%;
     }
   }
   ```

### Q: 如何创建自定义主题？

**A:** 
1. **通过主题编辑器**
   - 点击主题设置按钮
   - 调整颜色、字体、间距等
   - 保存为新主题

2. **代码方式创建**
   ```javascript
   const customTheme = {
     colors: {
       primary: '#your-color',
       secondary: '#your-color'
     },
     fonts: {
       body: 'Your Font Family'
     }
   };
   ```

## 性能问题

### Q: 页面加载很慢怎么办？

**A:** 
1. **组件懒加载**
   ```typescript
   const HeavyComponent = React.lazy(() => import('./HeavyComponent'));
   ```

2. **图片优化**
   - 使用适当的图片格式 (WebP, AVIF)
   - 压缩图片大小
   - 使用 CDN 加速

3. **代码分割**
   ```javascript
   // next.config.js
   module.exports = {
     experimental: {
       esmExternals: true
     }
   };
   ```

### Q: 大量数据渲染卡顿？

**A:** 
1. **虚拟滚动**
   ```typescript
   import { VirtualList } from '@/components';
   
   <VirtualList
     data={largeDataSet}
     itemHeight={50}
     renderItem={renderItem}
   />
   ```

2. **分页加载**
   ```javascript
   const [page, setPage] = useState(1);
   const pageSize = 20;
   
   const paginatedData = data.slice(
     (page - 1) * pageSize, 
     page * pageSize
   );
   ```

3. **数据缓存**
   ```javascript
   const { data } = useCache('data-key', fetchData, {
     ttl: 5 * 60 * 1000  // 5分钟缓存
   });
   ```

### Q: 内存占用过高？

**A:** 
1. **清理无用的事件监听器**
   ```javascript
   useEffect(() => {
     const handler = () => {};
     window.addEventListener('resize', handler);
     
     return () => {
       window.removeEventListener('resize', handler);
     };
   }, []);
   ```

2. **避免内存泄漏**
   ```javascript
   // 清理定时器
   useEffect(() => {
     const timer = setInterval(() => {}, 1000);
     return () => clearInterval(timer);
   }, []);
   ```

## 部署相关

### Q: 构建失败怎么办？

**A:** 
1. **检查依赖版本**
   ```bash
   # 清理依赖重新安装
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **内存不足**
   ```bash
   # 增加 Node.js 内存限制
   NODE_OPTIONS="--max-old-space-size=4096" npm run build
   ```

3. **TypeScript 错误**
   ```bash
   # 检查类型错误
   npx tsc --noEmit
   ```

### Q: 部署后页面空白？

**A:** 
1. **路径配置问题**
   ```javascript
   // next.config.js
   module.exports = {
     basePath: '/your-app',
     assetPrefix: '/your-app'
   };
   ```

2. **环境变量问题**
   ```bash
   # 检查生产环境变量
   NODE_ENV=production npm start
   ```

### Q: 如何配置 HTTPS？

**A:** 
1. **开发环境**
   ```bash
   # 使用 mkcert 生成本地证书
   mkcert localhost
   
   # 启动 HTTPS 开发服务器
   HTTPS=true npm run dev
   ```

2. **生产环境**
   ```nginx
   server {
     listen 443 ssl;
     ssl_certificate /path/to/cert.pem;
     ssl_certificate_key /path/to/key.pem;
   }
   ```

## 故障排除

### Q: 控制台出现错误信息？

**A:** 常见错误及解决方案：

1. **"Cannot read property of undefined"**
   ```javascript
   // 使用可选链操作符
   const value = data?.user?.name;
   
   // 或提供默认值
   const value = data && data.user && data.user.name || 'Default';
   ```

2. **"Module not found"**
   ```bash
   # 重新安装依赖
   npm install
   
   # 或检查导入路径
   import Component from './Component'; // 相对路径
   import { Component } from '@/components'; // 绝对路径
   ```

3. **"Hydration failed"**
   ```javascript
   // 确保服务端和客户端渲染一致
   const [mounted, setMounted] = useState(false);
   
   useEffect(() => {
     setMounted(true);
   }, []);
   
   if (!mounted) return null;
   ```

### Q: 数据不同步？

**A:** 
1. **检查状态更新**
   ```javascript
   // 使用函数式更新
   setState(prev => ({ ...prev, newValue }));
   
   // 避免直接修改状态
   // 错误: state.items.push(newItem)
   // 正确: setState({ ...state, items: [...state.items, newItem] })
   ```

2. **检查依赖数组**
   ```javascript
   useEffect(() => {
     fetchData();
   }, [dependency]); // 确保依赖正确
   ```

### Q: 如何调试组件问题？

**A:** 
1. **使用 React DevTools**
   - 安装浏览器扩展
   - 检查组件状态和属性
   - 查看组件层级结构

2. **添加调试日志**
   ```javascript
   console.log('组件状态:', state);
   console.log('属性值:', props);
   console.log('数据源:', dataSource);
   ```

3. **使用断点调试**
   ```javascript
   debugger; // 在关键位置添加断点
   ```

### Q: 如何获取技术支持？

**A:** 
1. **查看文档**: 首先查阅相关技术文档
2. **搜索问题**: 在 GitHub Issues 中搜索类似问题
3. **提交 Issue**: 详细描述问题和复现步骤
4. **社区讨论**: 参与社区讨论获取帮助

**提交问题时请包含：**
- 操作系统和浏览器版本
- Node.js 和 npm/pnpm 版本
- 错误信息和堆栈跟踪
- 复现步骤
- 相关代码片段

---

如果这里没有找到你遇到的问题，请查看 [用户手册](./user-guide.md) 或 [技术文档](../README.md)，也可以在 GitHub 上提交 Issue 获取帮助。