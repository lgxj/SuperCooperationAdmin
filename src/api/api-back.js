import { post, put, delRequest } from '@/api/api'

// 列表
export const getList = (page, limit, filter) => post('api/list', { page, limit, filter })

// 添加
export const add = ({ group_id, name, path, method, status, is_dev, is_login, sort, remark }) => post('api/add', { group_id, name, path, method, status, is_dev, is_login, sort, remark })

// 编辑
export const edit = ({ api_id, group_id, name, path, method, status, is_dev, is_login, sort, remark }) => put('api/edit', { api_id, group_id, name, path, method, status, is_dev, is_login, sort, remark })

// 删除
export const del = (api_id) => delRequest('api/del', { api_id })
