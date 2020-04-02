import { post } from '@/api/api'

// 获取支付列表信息
export const getList = (page, limit, filter) => post('/feerule/search', { page, limit, filter })
