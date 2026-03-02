const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB 连接成功');
    app.listen(process.env.PORT, () => {
      console.log(`服务运行在 http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB 连接失败:', err.message);
  });
