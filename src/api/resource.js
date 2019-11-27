import { post, put, delRequest } from '@/api/api'

// 列表
export const getList = (page, limit, filter) => post('resource/list', { page, limit, filter })

// 列表
export const getTree = (fid, children) => post('resource/tree', { fid, children })

// 添加
export const add = ({ name, code, type, fid, remark, status, is_dev, sort, apiIds }) => post('resource/add', { name, code, type, fid, remark, status, is_dev, sort, apiIds })

// 编辑
export const edit = ({ resource_id, name, code, type, fid, remark, status, is_dev, sort, apiIds }) => put('resource/edit', { resource_id, name, code, type, fid, remark, status, is_dev, sort, apiIds })

// 编辑依赖API
export const editApi = ({ resource_id, apiIds }) => put('resource/edit.resource', { resource_id, apiIds })

// 删除
export const del = (resource_id) => delRequest('resource/del', { resource_id })
