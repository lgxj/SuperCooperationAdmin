import { post, put, get, delRequest } from '@/api/api'

// 列表
export const getList = (page, limit, filter) => post('article/list', { page, limit, filter })

// 详情
export const getDetail = (id) => get('article/detail', { id })

// 添加
export const add = ({ category_id, title, content_type, link, tag, author, summary, cover, photos, content, sort }) => post('article/add', { category_id, title, content_type, link, tag, author, summary, cover, photos, content, sort })

// 编辑
export const edit = ({ article_id, category_id, title, content_type, link, tag, author, summary, cover, photos, content, sort }) => put('article/edit', { article_id, category_id, title, content_type, link, tag, author, summary, cover, photos, content, sort })

// 删除
export const del = (id) => delRequest('article/del', { id })
