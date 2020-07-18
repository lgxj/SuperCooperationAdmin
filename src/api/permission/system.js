import { post, put, delRequest, get } from '@/api/api'

// 列表
export const getList = (page, limit, filter) => post('system/list', { page, limit, filter })

// 字典
export const getDic = () => get('system/dic')

// 添加
export const add = ({ system_name, domain, desc }) => post('system/add', { system_name, domain, desc })

// 编辑
export const edit = ({ system_id, system_name, domain, desc }) => put('system/edit', { system_id, system_name, domain, desc })

// 删除
export const del = (system_id) => delRequest('system/del', { system_id })
