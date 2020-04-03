import { post } from '@/api/api'

// 获取任务统计信息
export const getOne = () => post('/task/day')
