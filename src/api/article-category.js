import { post, put, get, delRequest } from '@/api/api'

// 列表
export const getList = (page, limit, filter) => post('article-category/list', { page, limit, filter })

// 字典
export const getDic = () => get('article-category/dic')

// 全部
export const getAll = () => get('article-category/all')

// 详情
export const getDetail = (id) => get('article-category/detail', { id })

// 添加
export const add = ({ name, list_type, cover_size, list_fields, detail_fields, photo_size }) => post('article-category/add', { name, list_type, cover_size, list_fields, detail_fields, photo_size })

// 编辑
export const edit = ({ article_category_id, name, list_type, cover_size, list_fields, detail_fields, photo_size }) => put('article-category/edit', { article_category_id, name, list_type, cover_size, list_fields, detail_fields, photo_size })

// 删除
export const del = (id) => delRequest('article-category/del', { id })
