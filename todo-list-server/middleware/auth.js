const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

// 验证登录态中间件
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      return res.status(401).json({ message: '未授权，token无效' });
    }
  } else {
    return res.status(401).json({ message: '未授权，无token' });
  }
};

module.exports = { protect };
