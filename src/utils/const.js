/**
 * API 请求方式
 * @type {*[]}
 */
export const apiMethod = [
  'POST',
  'GET',
  'PUT',
  'DELETE'
]

/**
 * 状态：是否停用
 * @type {*[]}
 */
export const globalStatusDis = [
  '停用',
  '正常'
]

/**
 * 是与否
 * @type {*[]}
 */
export const globalYesNo = [
  '否',
  '是'
]

/**
 * 资源类型
 * @type {{'1': string, '2': string, '3': string}}
 */
export const globalResourceType = {
  1: '权限分组',
  2: '页面',
  3: '操作'
}

export const listType = {
  1: '下图',
  2: '上图',
  3: '左图',
  4: '右图'
}
