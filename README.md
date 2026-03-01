# TODO List 全栈应用

基于 Vue 3 + Express + MongoDB 的待办事项应用，支持 Web 登录和任务增删改查。

## 技术栈

- **前端**: Vue 3、Vite、Element Plus、Pinia、Vue Router、Axios
- **后端**: Node.js、Express、MongoDB、JWT
- **数据库**: MongoDB

## 快速开始

### 环境要求

- Node.js 18+
- MongoDB（本地或 [MongoDB Atlas](https://www.mongodb.com/atlas)）

### 1. 启动后端

```bash
cd todo-list-server
npm install
# 编辑 .env 配置 MONGODB_URI（本地: mongodb://127.0.0.1:27017/todo-list）
npm run dev
```

后端运行在 `http://localhost:3001`

### 2. 启动前端

```bash
cd todo-list-client
npm install
npm run dev
```

前端运行在 `http://localhost:5173`，通过 Vite 代理访问后端 API。

### 3. 使用流程

1. 打开浏览器访问 `http://localhost:5173`
2. 点击「去注册」创建账号，或直接登录
3. 登录后进入任务列表，可新增、编辑、删除、切换完成状态

## 项目结构

```
TEST/
├── todo-list-server/     # Express 后端
│   ├── models/           # User、Task 模型
│   ├── middleware/       # JWT 认证
│   ├── routes/           # 用户、任务 API
│   └── server.js
├── todo-list-client/     # Vue 3 前端
│   └── src/
│       ├── views/        # 登录页、任务列表页
│       ├── stores/       # Pinia 用户状态
│       ├── api/          # Axios 封装与接口
│       └── router/       # 路由与守卫
└── README.md
```

## API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/users/register | 注册 |
| POST | /api/users/login | 登录 |
| GET | /api/tasks | 获取任务列表 |
| POST | /api/tasks | 新增任务 |
| PUT | /api/tasks/:id | 更新任务 |
| DELETE | /api/tasks/:id | 删除任务 |

详见 `todo-list-server/README.md` 和 Postman 集合。
