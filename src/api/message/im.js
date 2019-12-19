import { get } from '@/api/api'

// 获取IM登录参数
export const getLoginParams = data => get('message/im/getLoginParams')
