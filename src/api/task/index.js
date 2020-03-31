import { post, get } from '@/api/api'

// 订单列表
export const getList = (page, limit, filter) => post('task/search', { page, limit, filter })

// 接单列表
export const getReceiveList = (page, limit, filter) => post('receive/search', { page, limit, filter })

// 任务详情
export const getDetail = (order_no) => get('task/detail', { order_no })
