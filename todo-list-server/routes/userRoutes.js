const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// 注册接口 POST /api/users/register
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: '用户名已存在' });
    }
    const user = await User.create({ username, password });
    res.status(201).json({
      _id: user._id,
      username: user.username,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// 登录接口 POST /api/users/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: '用户名或密码错误' });
    }
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

module.exports = router;
