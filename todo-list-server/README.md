# TODO List 后端 API

## 启动方式

1. 确保已安装 Node.js 和 MongoDB
2. `npm install`
3. 配置 `.env` 中的 `MONGODB_URI`（本地：`mongodb://127.0.0.1:27017/todo-list`）
4. `npm run dev`（或 `npm start`）

## Postman 测试

1. 导入 `postman_collection.json`
2. 先执行「注册」或「登录」，从响应中复制 `token` 到集合变量
3. 执行「新增任务」，从响应中复制任务 `_id` 到 `taskId` 变量
4. 依次测试获取、更新、删除任务
