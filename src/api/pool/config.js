import { post, put, delRequest } from '@/api/api'

// 列表
export const getList = () => post('config/list')

// 添加
export const add = ({ config_key, config_value, config_name, config_desc, config_type, config_extra, config_group }) => post('config/add', { config_key, config_value, config_name, config_desc, config_type, config_extra, config_group })

// 编辑
export const edit = ({ config_id, config_key, config_value, config_name, config_desc, config_type, config_extra, config_group }) => put('config/edit', { config_id, config_key, config_value, config_name, config_desc, config_type, config_extra, config_group })

// 修改值
export const setValue = ({ config_key, config_value }) => put('config/setValue', { config_key, config_value })

// 删除
export const del = (config_key) => delRequest('config/del', { config_key })
