import request from './request.js'

export const login = (data) => request.post('/users/login', data)
export const register = (data) => request.post('/users/register', data)
