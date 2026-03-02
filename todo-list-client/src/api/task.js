import request from './request.js'

export const getTasks = () => request.get('/tasks')
export const addTask = (data) => request.post('/tasks', data)
export const updateTask = (id, data) => request.put(`/tasks/${id}`, data)
export const deleteTask = (id) => request.delete(`/tasks/${id}`)
