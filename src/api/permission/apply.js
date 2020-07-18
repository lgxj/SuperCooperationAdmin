import { post, get, put, delRequest } from '@/api/api'

// 代理商申请列表
export const search = (page, limit, filter) => post('agent/apply/list', { page, limit, filter })

// 申请详情
export const getDetail = (id) => get('agent/apply/detail', { id })

// 同意申请
export const pass = (id, phone, areas) => put('agent/apply/pass', { id, phone, areas })

// 拒绝申请
export const refuse = (id) => put('agent/apply/refuse', { id })

// 批量拒绝申请
export const refuseBatch = (ids) => put('agent/apply/refuse.batch', { ids })

// 删除申请
export const del = (id) => delRequest('agent/apply/del', { id })

// 批量删除申请
export const delBatch = (ids) => delRequest('agent/apply/del.batch', { ids })
