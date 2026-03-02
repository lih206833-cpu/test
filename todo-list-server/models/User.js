const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, '用户名不能为空'],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, '密码不能为空'],
    minlength: [6, '密码长度不能少于6位']
  },
  createTime: {
    type: Date,
    default: Date.now
  }
});

// 密码加密（保存前触发）
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 验证密码方法
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
