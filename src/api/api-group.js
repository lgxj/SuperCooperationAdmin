import { post, put, get, delRequest } from '@/api/api'

// 列表
export const getList = (page, limit, filter) => post('api-group/list', { page, limit, filter })

// 字典
export const getDic = () => get('api-group/dic')

// 树型结构
export const getTree = () => get('api-group/tree')

// 添加
export const add = ({ name, sort }) => post('api-group/add', { name, sort })

// 编辑
export const edit = ({ api_group_id, name, sort }) => put('api-group/edit', { api_group_id, name, sort })

// 删除
export const del = (api_group_id) => delRequest('api-group/del', { api_group_id })
