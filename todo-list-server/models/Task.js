const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, '任务标题不能为空'],
    trim: true
  },
  content: {
    type: String,
    default: ''
  },
  status: {
    type: Boolean,
    default: false // false=未完成，true=已完成
  },
  createTime: {
    type: Date,
    default: Date.now
  },
  updateTime: {
    type: Date,
    default: Date.now
  }
});

// 更新时间自动更新
taskSchema.pre('save', function (next) {
  this.updateTime = Date.now();
  next();
});

module.exports = mongoose.model('Task', taskSchema);
