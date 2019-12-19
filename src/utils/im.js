import settings from '@/settings'
import TIM from 'tim-js-sdk'
import COS from 'cos-js-sdk-v5'
import Store from '../store'

// IM参数
const options = {
  SDKAppID: settings.IM_APPID // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
}
// 创建 SDK 实例
const tim = TIM.create(options)
// 设置 SDK 日志输出级别
tim.setLogLevel(1)

// 注册 COS SDK 插件
tim.registerPlugin({ 'cos-js-sdk': COS })

// 是否准备完成
tim.ready = false

// 监听事件
tim.on(TIM.EVENT.SDK_READY, function(event) {
  // 收到离线消息和会话列表同步完毕通知，接入侧可以调用 sendMessage 等需要鉴权的接口
  // event.name - TIM.EVENT.SDK_READY
  tim.ready = true
  console.log('im ready')
})

tim.on(TIM.EVENT.MESSAGE_RECEIVED, function(event) {
  // 收到推送的单聊、群聊、群提示、群系统通知的新消息，可通过遍历 event.data 获取消息列表数据并渲染到页面
  // event.name - TIM.EVENT.MESSAGE_RECEIVED
  // event.data - 存储 Message 对象的数组 - [Message]
  console.log('新消息', event.data)
  Store.dispatch('msg/changeValue', { key: 'num', value: 1 })
})

tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, function(event) {
  // 收到会话列表更新通知，可通过遍历 event.data 获取会话列表数据并渲染到页面
  // event.name - TIM.EVENT.CONVERSATION_LIST_UPDATED
  // event.data - 存储 Conversation 对象的数组 - [Conversation]
  console.log('im conversation list updated')
})

tim.on(TIM.EVENT.GROUP_LIST_UPDATED, function(event) {
  // 收到群组列表更新通知，可通过遍历 event.data 获取群组列表数据并渲染到页面
  // event.name - TIM.EVENT.GROUP_LIST_UPDATED
  // event.data - 存储 Group 对象的数组 - [Group]
  console.log('im group list updated')
})

tim.on(TIM.EVENT.GROUP_SYSTEM_NOTICE_RECEIVED, function(event) {
  // 收到新的群系统通知
  // event.name - TIM.EVENT.GROUP_SYSTEM_NOTICE_RECEIVED
  // event.data.type - 群系统通知的类型，详情请参见 GroupSystemNoticePayload 的 operationType 枚举值说明
  // event.data.message - Message 对象，可将 event.data.message.content 渲染到到页面
  console.log('im group system notice received')
})

tim.on(TIM.EVENT.PROFILE_UPDATED, function(event) {
  // 收到自己或好友的资料变更通知
  // event.name - TIM.EVENT.PROFILE_UPDATED
  // event.data - 存储 Profile 对象的数组 - [Profile]
  console.log('im profile updated')
})

tim.on(TIM.EVENT.BLACKLIST_UPDATED, function(event) {
  // 收到黑名单列表更新通知
  // event.name - TIM.EVENT.BLACKLIST_UPDATED
  // event.data - 存储 userID 的数组 - [userID]
  console.log('im blacklist updated')
})

tim.on(TIM.EVENT.ERROR, function(event) {
  // 收到 SDK 发生错误通知，可以获取错误码和错误信息
  // event.name - TIM.EVENT.ERROR
  // event.data.code - 错误码
  // event.data.message - 错误信息
  console.log('im sdk error:', event.data.message)
})

tim.on(TIM.EVENT.SDK_NOT_READY, function(event) {
  // 收到 SDK 进入 not ready 状态通知，此时 SDK 无法正常工作
  // event.name - TIM.EVENT.SDK_NOT_READY
  console.log('im sdk not ready')
})

tim.on(TIM.EVENT.KICKED_OUT, function(event) {
  // 收到被踢下线通知
  // event.name - TIM.EVENT.KICKED_OUT
  // event.data.type - 被踢下线的原因，例如 TIM.TYPES.KICKED_OUT_MULT_ACCOUNT 多账号登录被踢
  console.log('im kicked out')
})

/**
 * 创建文本消息
 */
const createMessage = (to, obj, type = 'text', conv = 1) => {
  let convType
  if (conv === 1) {
    convType = TIM.TYPES.CONV_C2C
  } else if (conv === 2) {
    convType = TIM.TYPES.CONV_GROUP
  } else {
    convType = TIM.TYPES.CONV_SYSTEM
  }

  let payload
  let action
  if (type === 'text') {
    payload = {
      text: obj
    }
    action = tim.createTextMessage
  } else if (type === 'image') {
    payload = {
      file: obj
    }
    action = tim.createImageMessage
  } else if (type === 'file') {
    payload = {
      file: document.getElementById(obj)
    }
    action = tim.createFileMessage
  } else if (type === 'face') {
    payload = {
      index: obj.index,
      data: obj.data
    }
    action = tim.createFaceMessage
  } else if (type === 'custom') {
    payload = {
      data: obj.data,
      description: obj.description,
      extension: obj.extension
    }
    action = tim.createCustomMessage
  }

  return action({
    to,
    conversationType: convType,
    payload
  })
}

/**
 * 发送消息
 * @param to 接收方
 * @param obj 发送内容
 * @param type 内容类型
 * @param conv 发送类型
 * @returns {*}
 */
export const sendMessage = (to, obj, type = 'text', conv = 1) => {
  const msg = createMessage(to, obj, type, conv)
  console.log(msg)
  return tim.sendMessage(msg)
}

export default tim
