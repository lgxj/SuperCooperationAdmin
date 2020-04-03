import { post } from '@/api/api'

// 获取任务统计信息
export const getList = (page, limit, filter) => post('/task/day.search', { page, limit, filter })
