import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user.js'
import Login from '../views/Login.vue'
import TaskList from '../views/TaskList.vue'

const routes = [
  { path: '/login', name: 'Login', component: Login, meta: { requiresAuth: false } },
  { path: '/tasks', name: 'TaskList', component: TaskList, meta: { requiresAuth: true } },
  { path: '/', redirect: '/tasks' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const token = userStore.token || localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    next('/tasks')
  } else {
    next()
  }
})

export default router
