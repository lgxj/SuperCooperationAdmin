import { post, put, get, delRequest } from '@/api/api'

// 列表
export const getList = (page, limit, filter) => post('task.category/list', { page, limit, filter })

// 添加
export const add = ({ category_name, sort }) => post('task.category/add', { category_name, sort })

// 编辑
export const edit = ({ category_id, category_name, sort }) => put('task.category/edit', { category_id, category_name, sort })

// 删除
export const del = (category_id) => delRequest('task.category/del', { category_id })

// 字典
export const getDic = _ => get('task.category/dic')
