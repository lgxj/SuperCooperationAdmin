import { post, put, get } from '@/api/api'

// 列表
export const getList = (page, limit, filter) => post('user/getList', { page, limit, filter })

// 冻结
export const frozen = (user_id) => put('user/frozen', { user_id })

// 解冻
export const unFrozen = (user_id) => put('user/unFrozen', { user_id })

// 获取实名认证信息
export const getUserCertification = (user_id) => get('user/certification', { user_id })
