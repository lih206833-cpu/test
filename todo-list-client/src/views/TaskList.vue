<template>
  <div class="task-page">
    <div class="header">
      <h2>欢迎，{{ userStore.username }}！</h2>
      <el-button type="danger" @click="handleLogout">退出登录</el-button>
    </div>

    <el-card class="task-card">
      <template #header>
        <span>我的任务</span>
      </template>

      <div class="add-form">
        <el-input
          v-model="newTitle"
          placeholder="输入任务标题"
          style="width: 300px; margin-right: 12px"
          @keyup.enter="handleAdd"
        />
        <el-input
          v-model="newContent"
          placeholder="输入任务详情（可选）"
          style="width: 200px; margin-right: 12px"
          @keyup.enter="handleAdd"
        />
        <el-button type="primary" :loading="adding" @click="handleAdd">
          新增任务
        </el-button>
      </div>

      <el-table :data="tasks" style="margin-top: 20px" v-loading="loading">
        <el-table-column prop="title" label="标题" min-width="150" />
        <el-table-column prop="content" label="详情" min-width="200" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status ? 'success' : 'info'">
              {{ row.status ? '已完成' : '未完成' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatTime(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="openEdit(row)">编辑</el-button>
            <el-button
              size="small"
              :type="row.status ? 'info' : 'success'"
              @click="toggleStatus(row)"
            >
              {{ row.status ? '标为未完成' : '标为完成' }}
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-empty v-if="!loading && tasks.length === 0" description="暂无任务，去添加一个吧~" />
    </el-card>

    <el-dialog v-model="editVisible" title="编辑任务" width="500px" @close="resetEdit">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="editForm.title" />
        </el-form-item>
        <el-form-item label="详情">
          <el-input v-model="editForm.content" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="editForm.status" active-text="已完成" inactive-text="未完成" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" :loading="editing" @click="handleEdit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '../stores/user.js'
import { getTasks, addTask, updateTask, deleteTask } from '../api/task.js'

const router = useRouter()
const userStore = useUserStore()

const tasks = ref([])
const loading = ref(false)
const adding = ref(false)
const editing = ref(false)
const newTitle = ref('')
const newContent = ref('')

const editVisible = ref(false)
const editForm = ref({
  id: '',
  title: '',
  content: '',
  status: false
})

const formatTime = (time) => {
  if (!time) return ''
  const d = new Date(time)
  return d.toLocaleString('zh-CN')
}

const fetchTasks = async () => {
  loading.value = true
  try {
    const res = await getTasks()
    tasks.value = res.data
  } catch (err) {
    ElMessage.error(err.response?.data?.message || '获取任务失败')
  } finally {
    loading.value = false
  }
}

const handleAdd = async () => {
  if (!newTitle.value.trim()) {
    ElMessage.warning('请输入任务标题')
    return
  }
  adding.value = true
  try {
    await addTask({ title: newTitle.value.trim(), content: newContent.value.trim() })
    newTitle.value = ''
    newContent.value = ''
    ElMessage.success('添加成功')
    fetchTasks()
  } catch (err) {
    ElMessage.error(err.response?.data?.message || '添加失败')
  } finally {
    adding.value = false
  }
}

const openEdit = (row) => {
  editForm.value = {
    id: row._id,
    title: row.title,
    content: row.content || '',
    status: row.status
  }
  editVisible.value = true
}

const resetEdit = () => {
  editForm.value = { id: '', title: '', content: '', status: false }
}

const handleEdit = async () => {
  if (!editForm.value.title?.trim()) {
    ElMessage.warning('标题不能为空')
    return
  }
  editing.value = true
  try {
    await updateTask(editForm.value.id, {
      title: editForm.value.title.trim(),
      content: editForm.value.content?.trim() || '',
      status: editForm.value.status
    })
    editVisible.value = false
    ElMessage.success('更新成功')
    fetchTasks()
  } catch (err) {
    ElMessage.error(err.response?.data?.message || '更新失败')
  } finally {
    editing.value = false
  }
}

const toggleStatus = async (row) => {
  try {
    await updateTask(row._id, { status: !row.status })
    ElMessage.success('状态已更新')
    fetchTasks()
  } catch (err) {
    ElMessage.error(err.response?.data?.message || '更新失败')
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该任务吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteTask(row._id)
    ElMessage.success('删除成功')
    fetchTasks()
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error(err.response?.data?.message || '删除失败')
    }
  }
}

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}

onMounted(() => {
  fetchTasks()
})
</script>

<style scoped>
.task-page {
  min-height: 100vh;
  padding: 24px;
  background: #f5f7fa;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 0 8px;
}
.header h2 {
  margin: 0;
  font-size: 24px;
}
.task-card {
  max-width: 900px;
  margin: 0 auto;
}
.add-form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}
</style>
