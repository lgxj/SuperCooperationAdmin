/**
 * 用户状态
 * @type {*[]}
 */
export const userStatus = [
  '冻结',
  '正常'
]

/**
 * 用户注册类型
 * @type {*[]}
 */
export const userRegType = {
  0: '手机号',
  1: '微信',
  2: '微信Web',
  3: 'QQ',
  4: '微博',
  5: '邮箱',
  6: '后台账号'
}

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

/**
 * 文章列表样式
 * @type {{'1': string, '2': string, '3': string, '4': string}}
 */
export const listType = {
  1: '下图',
  2: '上图',
  3: '左图',
  4: '右图'
}

/**
 * 时间时间选择器配置
 * @type {{shortcuts: *[]}}
 */
export const datetimeRangePickerOptions = {
  shortcuts: [
    {
      text: '最近一周',
      onClick(picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '最近一个月',
      onClick(picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '最近三个月',
      onClick(picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
        picker.$emit('pick', [start, end])
      }
    }]
}
