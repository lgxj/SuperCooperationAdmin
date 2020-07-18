import { post, put, get, delRequest } from '@/api/api'

// 列表
export const getList = (page, limit, system_id) => post('api-group/list', { page, limit, system_id })

// 字典
export const getDic = (system_id) => get('api-group/dic', { system_id })

// 树型结构
export const getTree = (system_id) => get('api-group/tree', { system_id })

// 添加
export const add = ({ system_id, name, sort }) => post('api-group/add', { system_id, name, sort })

// 编辑
export const edit = ({ api_group_id, name, sort }) => put('api-group/edit', { api_group_id, name, sort })

// 删除
export const del = (api_group_id) => delRequest('api-group/del', { api_group_id })
