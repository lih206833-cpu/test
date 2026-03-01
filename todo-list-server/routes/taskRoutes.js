const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');

// 获取当前用户的所有任务 GET /api/tasks
router.get('/', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id }).sort({ createTime: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// 添加任务 POST /api/tasks
router.post('/', protect, async (req, res) => {
  try {
    const { title, content } = req.body;
    const task = await Task.create({
      userId: req.user._id,
      title,
      content: content || ''
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// 更新任务 PUT /api/tasks/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const { title, content, status } = req.body;
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (status !== undefined) updateData.status = status;
    updateData.updateTime = Date.now();

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      updateData,
      { new: true, runValidators: true }
    );
    if (!task) {
      return res.status(404).json({ message: '任务不存在或无权限' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// 删除任务 DELETE /api/tasks/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!task) {
      return res.status(404).json({ message: '任务不存在或无权限' });
    }
    res.json({ message: '任务删除成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

module.exports = router;
