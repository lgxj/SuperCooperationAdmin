import { post, get, put } from '@/api/api'

// 登录
export const login = data => post('admin/login', data)

// 获取用户信息
export const getInfo = () => get('admin/info')

// 登出
export const logout = () => post('admin/logout')

// 列表
export const getList = (page, limit, filter) => post('admin/list', { page, limit, filter })

// 添加
export const add = ({ username, password, name, avatar, roleIds }) => post('admin/add', { username, password, name, avatar, roleIds })

// 编辑
export const edit = ({ admin_id, username, name, avatar, roleIds }) => put('admin/edit', { admin_id, username, name, avatar, roleIds })

// 重置密码
export const resetPwd = ({ admin_id, password }) => put('admin/reset_pwd', { admin_id, password })

// 冻结
export const frozen = (admin_id) => put('admin/frozen', { admin_id })

// 解冻
export const unFrozen = (admin_id) => put('admin/unFrozen', { admin_id })

// 日志列表
export const getLogList = (page, limit, filter) => post('admin/logs', { page, limit, filter })
