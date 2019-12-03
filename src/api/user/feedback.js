import { post, get, delRequest } from '@/api/api'

// 列表
export const getList = (page, limit, filter) => post('feedback/getList', { page, limit, filter })

// 反馈类型
export const getFeedbackTypes = _ => get('feedback/types')

// 删除
export const del = id => delRequest('feedback/del', { id })
