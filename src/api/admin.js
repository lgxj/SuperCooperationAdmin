import { post, get, put, delRequest } from '@/api/api'

// 登录
export const login = data => post('admin/login', data)

// 获取用户信息
export const getInfo = () => get('admin/info')

// 登出
export const logout = () => post('admin/logout')

// 列表
export const getList = (page, limit, filter) => post('admin/list', { page, limit, filter })

// 添加
export const add = ({ phone, password, user_name, user_avatar, roleIds }) => post('admin/add', { phone, password, user_name, user_avatar, roleIds })

// 编辑
export const edit = ({ user_id, phone, user_name, user_avatar, roleIds }) => put('admin/edit', { user_id, phone, user_name, user_avatar, roleIds })

// 重置密码
export const resetPwd = ({ user_id, password }) => put('admin/reset_pwd', { user_id, password })

// 修改密码
export const resetSelfPwd = ({ password_old, password }) => put('admin/reset_pwd.self', { password_old, password })

// 日志列表
export const getLogList = (page, limit, filter) => post('admin/logs', { page, limit, filter })

// 重置密码
export const del = (user_id) => delRequest('admin/del', { user_id })

// 根据手机号查用户
export const searchByPhone = (phone) => get('user/searchByPhone', { phone })
