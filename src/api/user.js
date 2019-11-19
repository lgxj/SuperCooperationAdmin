import { post, get } from '@/api/api'

// 登录
export const login = data => post('user/login', data)

// 获取用户信息
export const getInfo = () => get('user/info')

// 登出
export const logout = () => post('/user/logout')
