import { post, put } from '@/api/api'

// 获取收费管理列表
export const getList = (page, limit, filter) => post('/feerule/search', { page, limit, filter })

// 编辑信息
export const edit = ({ fee_rule_id, ratio, state }) => put('feerule/edit', { fee_rule_id, ratio, state })
