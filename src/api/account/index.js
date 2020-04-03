import { post, get } from '@/api/api'

// 获取提现列表信息
export const getList = (page, limit, filter) => post('/withdraw/search', { page, limit, filter })

// 通过审核
export const verify = (user_id, withdraw_no) => post('/withdraw/verify', { user_id, withdraw_no })

// 审核重试
export const retry = (user_id, withdraw_no) => post('/withdraw/retry', { user_id, withdraw_no })

// 账户管理-账户搜索
export const search = (page, limit, filter) => post('/account/search', { page, limit, filter })

// 账户管理-单个用户余额获取
export const getBalance = (user_id) => get('/account/get', { user_id })

// 账户管理-修改余额
export const addBalance = (user_id, money) => post('/account/addBalance', { user_id, money })
