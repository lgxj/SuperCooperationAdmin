import { post } from '@/api/api'

// 获取提现列表信息
export const getList = (page, limit, filter) => post('/withdraw/search', { page, limit, filter })

// 通过审核
export const verify = (user_id, withdraw_no) => post('/withdraw/verify', { user_id, withdraw_no })

// 审核重试
export const retry = (user_id, withdraw_no) => post('/withdraw/retry', { user_id, withdraw_no })
