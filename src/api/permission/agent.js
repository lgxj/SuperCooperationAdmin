import { post, get, put } from '@/api/api'

// 代理商列表
export const search = (page, limit, filter) => post('agent/list', { page, limit, filter })

// 代理商详情
export const getDetail = (id) => get('agent/detail', { id })

// 修改代理商信息
export const update = (data) => put('agent/update', data)

//  停用代理商
export const stop = (id) => put('agent/stop', { id })

// 启用代理商
export const enable = (id) => put('agent/enable', { id })

// 修改代理区域
export const areasUpdate = (data) => put('agent/areas/update', data)
