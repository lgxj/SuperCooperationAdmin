import { post, put, delRequest } from '@/api/api'

// 列表
export const getList = () => post('upgrade/list')

// 添加
export const add = ({ app_type, version_name, version, download_url, is_hot, is_force, is_tip, is_gray, description }) => post('upgrade/add', { app_type, version_name, version, download_url, is_hot, is_force, is_tip, is_gray, description })

// 编辑
export const edit = ({ app_id, app_type, version_name, version, download_url, is_hot, is_force, is_tip, is_gray, description }) => put('upgrade/edit', { app_id, app_type, version_name, version, download_url, is_hot, is_force, is_tip, is_gray, description })

// 删除
export const del = (app_id) => delRequest('upgrade/del', { app_id })
