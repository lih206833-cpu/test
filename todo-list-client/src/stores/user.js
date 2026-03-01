import { defineStore } from 'pinia'
import request from '../api/request.js'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: JSON.parse(localStorage.getItem('userInfo') || 'null')
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
    username: (state) => state.userInfo?.username || ''
  },
  actions: {
    setAuth(data) {
      this.token = data.token
      this.userInfo = { _id: data._id, username: data.username }
      localStorage.setItem('token', data.token)
      localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
    },
    logout() {
      this.token = ''
      this.userInfo = null
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
    }
  }
})
