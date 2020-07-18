import { post, put, get, delRequest } from '@/api/api'

// 列表
export const getList = (page, limit, system_id) => post('role/list', { page, limit, system_id })

// 字典
export const getDic = (system_id) => get('role/dic', { system_id })

// 添加
export const add = ({ system_id, name, code, remark, resourceIds }) => post('role/add', { system_id, name, code, remark, resourceIds })

// 编辑
export const edit = ({ role_id, name, code, remark }) => put('role/edit', { role_id, name, code, remark })

// 编辑权限
export const editResource = ({ role_id, resourceIds }) => put('role/edit.resource', { role_id, resourceIds })

// 删除
export const del = (role_id) => delRequest('role/del', { role_id })
