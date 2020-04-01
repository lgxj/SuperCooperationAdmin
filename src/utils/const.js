// 平台
export const appTypes = {
  android: '安桌',
  ios: 'iOS'
}

// APP更新类型
export const appUpdateTypes = {
  1: '资源更新包',
  0: '完整安装包'
}

// 雇主任务状态
export const EMPLOYER_STATE_UN_START = 0	// 未开始
export const EMPLOYER_STATE_UN_RECEIVE = 1 // 待帮手接单
export const EMPLOYER_STATE_UN_CONFIRM = 2 // 待帮手竞价
export const EMPLOYER_STATE_RECEIVE = 3 // 已接单
export const EMPLOYER_STATE_DELIVERED = 4 // 已交付
export const EMPLOYER_STATE_CANCEL = 5 // 已取消
export const EMPLOYER_STATE_COMPLETE = 6 // 已完成
export const EMPLOYER_STATE_REFUSE_DELIVERY = 7 // 拒绝交付

// 帮手任务状态
export const HELPER_STATE_EMPLOYER_UN_CONFIRM = 5	// 待雇主确认(报价后)
export const HELPER_STATE_RECEIVE = 1 // 已接单
export const HELPER_STATE_CANCEL = 2 // 已取消
export const HELPER_STATE_DELIVERED = 3 // 已交付
export const HELPER_STATE_COMPLETE = 4 // 已完成
export const HELPER_STATE_REFUSE_DELIVERY = 6 // 交付被拒绝

/**
 * 雇主任务状态
 * @type {{EMPLOYER_STATE_REFUSE_DELIVERY: string, EMPLOYER_STATE_DELIVERED: string, EMPLOYER_STATE_UN_RECEIVE: string, EMPLOYER_STATE_COMPLETE: string, EMPLOYER_STATE_UN_START: string, EMPLOYER_STATE_UN_CONFIRM: string, EMPLOYER_STATE_CANCEL: string, EMPLOYER_STATE_RECEIVE: string}}
 */
export const taskStatus = {
  0: '未开始',
  1: '待帮手接单',
  2: '待帮手竞价',
  3: '已接单',
  4: '已交付',
  5: '已取消',
  6: '已完成',
  7: '拒绝交付'
}

/**
 * 帮手任务状态
 * @type {{HELPER_STATE_CANCEL: string, HELPER_STATE_EMPLOYER_UN_CONFIRM: string, HELPER_STATE_DELIVERED: string, HELPER_STATE_COMPLETE: string, HELPER_STATE_REFUSE_DELIVERY: string, HELPER_STATE_RECEIVE: string}}
 */
export const taskReceiveStatus = {
  5:	'待雇主确认',
  1:	'已接单',
  2:	'已取消',
  3:	'已交付',
  4:	'已完成',
  6:	'交付被拒绝'
}

/**
 * 任务类型
 * @type {{'0': string, '1': string}}
 */
export const taskTypes = {
  0: '悬赏任务',
  1: '竞价任务'
}

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
  6: '后台账号',
  7: '支付宝'
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

/**
 * 提现状态
 * @type {{"0": string, "1": string, "2": string, "3": string, "4": string}}
 */
export const withdrawStatus = {
  0: '待审核',
  1: '已审核',
  2: '待重试/提现中',
  3: '已完成',
  4: '提现失败'
}
