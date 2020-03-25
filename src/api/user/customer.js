import { post, get, put } from '@/api/api'

// 列表
export const getList = (page, limit, filter) => post('customer/getList', { page, limit, filter })

// 搜索可添加为客服的用户
export const search = (user_name) => get('customer/search', { user_name })

// 添加
export const add = (user_id) => post('customer/add', { user_id })

// 取消
export const cancel = (user_id) => put('customer/cancel', { user_id })

// 接待用户列表
export const getServiceUserList = (customer_id, page, limit) => get('customer/service.user', { customer_id, page, limit })

// 接待用户聊天记录
export const getServiceMsgList = (message_id, order, page, limit) => get('customer/service.msg', { message_id, order, page, limit })
