# WishStar - 3D许愿星球应用

一个基于React Native和Three.js的3D许愿应用，让用户通过精美的3D交互体验来许愿和分享愿望。

## 功能特点

- 3D星球许愿系统
- 实时多人互动
- AR增强现实体验
- AI智能分析和建议
- 社交分享和互动
- 游戏化成长系统

## 技术栈

- 前端：React Native + TypeScript + Three.js
- 后端：Node.js + Express
- 数据库：MongoDB + Redis
- 实时通信：Socket.io
- AI服务：OpenAI API
- AR功能：ARKit/ARCore

## 开始使用

### 环境要求

- Node.js >= 14
- React Native环境
- MongoDB
- Redis

### 安装步骤

1. 克隆项目
```bash
git clone https://github.com/yourusername/wishstar.git
cd wishstar
```

2. 安装依赖
```bash
# 安装共享依赖
npm install

# 安装移动端依赖
cd mobile
npm install

# 安装服务端依赖
cd ../server
npm install
```

3. 配置环境变量
```bash
cp .env.example .env
# 编辑.env文件，填入必要的配置信息
```

4. 启动开发服务器
```bash
# 启动后端服务
cd server
npm run dev

# 启动移动端开发环境
cd ../mobile
npm run ios # 或 npm run android
```

## 项目结构

```
wishstar/
├── mobile/                 # 移动端应用
├── server/                 # 后端服务
└── shared/                 # 共享代码
```

## 开发指南

详细的开发文档请参考 `docs` 目录：

- [开发环境搭建](docs/setup.md)
- [架构设计](docs/architecture.md)
- [API文档](docs/api.md)
- [前端开发指南](docs/frontend.md)
- [后端开发指南](docs/backend.md)

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件 