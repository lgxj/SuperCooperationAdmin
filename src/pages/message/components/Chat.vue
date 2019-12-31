<template>
  <div>
    <el-card class="box-card" :body-style="{ padding: '0' }">
      <div slot="header" class="clearfix">
        <span>{{ user.nick || '&nbsp;' }}</span>
        <!--<el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
      </div>
      <div id="chat-plan" class="chat-plan">
        <div v-if="!isCompleted" class="btn-load-history" @click="getMessageList(true)">历史消息</div>
        <div v-for="(item, index) in list" :id="item.ID" :key="index" class="text item flex">
          <template v-if="item.flow === 'in'">
            <div class="flex-0">
              <el-image
                class="avatar"
                :src="user.avatar"
                fit="cover"
              >
                <div slot="error" class="flex flex-align-center image-error" style="height: 100%">
                  <div class="flex-auto text-center" style="font-size: 16px">{{ firstWord(user.nick) }}</div>
                </div>
              </el-image>
            </div>
            <div class="flex-auto pl-10" style="min-width: 0">
              <div class="title">
                <!--<span class="name">{{ user.nick }}</span>-->
                <span class="time">{{ formatTime(item.time) }}</span>
              </div>
              <div class="content flex">
                <div class="desc flex-0 flex">
                  <div v-for="(subItem, idx) in parsePayload(item.payload, item.type)" :key="idx">
                    <div v-if="subItem.type === 'image'" class="msg-img-item">
                      <el-image
                        class="msg-img"
                        :src="subItem.src"
                        fit="cover"
                        :preview-src-list="[subItem.src]"
                      />
                    </div>
                    <div v-if="subItem.type === 'address'" class="msg-address">
                      <div class="name">[地址] {{ subItem.data.name }}</div>
                      <div class="address">{{ subItem.data.address }}</div>
                      <div v-if="subItem.data.pic" class="map">
                        <el-image class="map" :src="subItem.data.pic" fit="cover" />
                      </div>
                    </div>
                    <div v-else v-html="subItem.text" />
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="flex-auto pr-10" style="min-width: 0; text-align: right">
              <div class="title">
                <span class="time pl-5">{{ formatTime(item.time) }}</span>
              </div>
              <div class="content flex flex-direction-row-reverse">
                <div class="desc flex">
                  <div v-for="(subItem, idx) in parsePayload(item.payload, item.type)" :key="idx">
                    <el-image
                      v-if="subItem.type === 'image'"
                      class="msg-img"
                      :src="subItem.src"
                      fit="cover"
                      :preview-src-list="[subItem.src]"
                    />
                    <div v-if="subItem.type === 'address'" class="msg-address" @click="toMap(subItem.data)">
                      <div class="name">[地址] {{ subItem.data.name }}</div>
                      <div class="address">{{ subItem.data.address }}</div>
                      <div v-if="subItem.data.pic" class="map">
                        <el-image class="map" :src="subItem.data.pic" fit="cover" />
                      </div>
                    </div>
                    <div v-else v-html="subItem.text" />
                  </div>
                </div>
              </div>
            </div>
            <div class="flex-0">
              <el-image
                class="avatar"
                :src="my.avatar"
                fit="cover"
              >
                <div slot="error" class="flex flex-align-center image-error" style="height: 100%">
                  <div class="flex-auto text-center" style="font-size: 16px">{{ firstWord(my.nick) }}</div>
                </div>
              </el-image>
            </div>
          </template>
        </div>
      </div>

      <div class="input-box">
        <el-form :inline="true" :model="info" class="demo-form-inline">
          <div class="flex">
            <div class="flex-auto">
              <el-input v-model="info.text" type="textarea" autosize placeholder="请输入内容" />
            </div>
            <div class="flex-0 pl-5">
              <my-upload :show-file-list="false" :list-type="'text'" :before-upload-action="handleImageSelect" @change="handleImageSelect">
                <i class="el-icon-picture-outline btn-img" />
              </my-upload>
            </div>
            <div class="flex-0 pl-5">
              <el-button type="primary" size="small" @click="onSubmit">发送</el-button>
            </div>
          </div>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { formatTime } from '@/utils'
import { sendMessage } from '@/utils/im'
import TIM from 'tim-js-sdk'
import MyUpload from '@/components/MyUpload'

const msgCount = 10
const emojiMap = { // 根据[呲牙]可匹配的路径地址
  '[微笑]': 'emoji_0.png',
  '[呲牙]': 'emoji_1.png',
  '[下雨]': 'emoji_2.png'
}

const emojiUrl = 'http://xxxxxxxx/emoji/'

export default {
  name: 'List',
  components: { MyUpload },
  props: {
    conversationId: {
      type: String,
      default: ''
    },
    user: {
      type: Object,
      default() {
        return {}
      }
    },
    unreadCount: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      nextReqMessageID: '', // 用于续拉，分页续拉时需传入该字段。
      isCompleted: true, // 表示是否已经拉完所有消息。
      info: {
        text: ''
      },
      list: [],
      my: {}
    }
  },
  watch: {
    conversationId(val) {
      this.list = []
      this.nextReqMessageID = ''
      this.isCompleted = true
      if (val) {
        this.getMessageList()
        this.setMessageRead(val, this.unreadCount)
      }
    }
  },
  created() {
    if (this.conversationId) {
      this.getMessageList()
      this.setMessageRead(this.conversationId, this.unreadCount)
    }
    // 当前用户信息
    this.my = {
      nick: this.$store.state.admin.name,
      avatar: this.$store.state.admin.avatar
    }
    // 新消息
    this.$tim.on(TIM.EVENT.MESSAGE_RECEIVED, event => {
      let currentUser = false
      event.data.map(item => {
        if (item.from === this.user.userID) {
          currentUser = true
          this.list.push(item)
        }
      })
      if (currentUser) {
        this.setMessageRead(this.conversationId, event.data.length)
      }
      this.scrollToBottom()
    })
  },
  methods: {
    // 格式化时间
    formatTime(time) {
      return formatTime(time)
    },
    // 设置已读
    setMessageRead(conversationId, readNum = 1) {
      if (!readNum) return
      setTimeout(_ => {
        this.$tim.setMessageRead({
          conversationID: conversationId
        }).then(_ => {
          this.$store.dispatch('msg/changeValue', { key: 'num', value: this.$store.state.msg.num - readNum })
        })
      }, 2000)
    },
    // 滚动到指定元素
    goAnchor(selector) {
      this.$nextTick(() => {
        this.$el.querySelector(selector).scrollIntoView({
          behavior: 'smooth', // 平滑过渡
          block: 'start' // 上边框与视窗顶部平齐。默认值
        })
      })
    },
    // 滚动到底部
    scrollToBottom() {
      this.$nextTick(_ => {
        const container = this.$el.querySelector('#chat-plan')
        container.scrollTop = container.scrollHeight
      })
    },
    // 加载聊天历史记录
    getMessageList(loadHistory = false) {
      if (!this.conversationId) return
      const data = {
        conversationID: this.conversationId,
        count: msgCount
      }
      const nextReqMessageID = this.nextReqMessageID
      if (loadHistory && nextReqMessageID) {
        data.nextReqMessageID = nextReqMessageID
      }
      this.$tim.getMessageList(data).then(res => {
        const messageList = res.data.messageList // 消息列表
        this.list.splice(0, 0, ...messageList)
        this.nextReqMessageID = res.data.nextReqMessageID // 用于续拉，分页续拉时需传入该字段
        this.isCompleted = res.data.isCompleted // 表示是否已经拉完所有消息
        if (!loadHistory) {
          this.scrollToBottom()
        } else {
          // this.goAnchor('#' + nextReqMessageID)
        }
      })
    },
    // 发送图片
    handleImageSelect(e) {
      if (e) {
        sendMessage(this.user.userID, e, 'image').then(res => {
          this.list.push(res.data.message)
          this.scrollToBottom()
        })
      }
    },
    // 发送
    onSubmit() {
      const text = this.info.text
      if (String(text) === '') return
      sendMessage(this.user.userID, text).then(res => {
        this.list.push(res.data.message)
        this.scrollToBottom()
      }).catch(err => {
        console.log(err)
        console.log('发送失败')
      })
      this.info.text = ''
    },
    formatText(text) {
      return String(text).replace(/\n/gm, '<br/>')
    },
    parsePayload(payload, type) {
      if (type === 'TIMImageElem') {
        return [{ type: 'image', src: payload.imageInfoArray[0].imageUrl }]
      } else if (type === 'TIMCustomElem') {
        const subType = payload.description
        const data = JSON.parse(payload.extension)
        return [{ type: subType, data }]
      } else {
        return [{ type: 'text', text: this.formatText(payload.text) }]
      }
    },
    // 格式化文本消息
    parseText(payload) {
      const renderDom = []
      // 文本消息
      let temp = payload.text
      let left = -1
      let right = -1
      while (temp !== '') {
        left = temp.indexOf('[')
        right = temp.indexOf(']')
        switch (left) {
          case 0:
            if (right === -1) {
              renderDom.push({
                name: 'text',
                text: temp
              })
              temp = ''
            } else {
              const _emoji = temp.slice(0, right + 1)
              if (emojiMap[_emoji]) { // 如果您需要渲染表情包，需要进行匹配您对应[呲牙]的表情包地址
                renderDom.push({
                  name: 'img',
                  src: emojiUrl + emojiMap[_emoji]
                })
                temp = temp.substring(right + 1)
              } else {
                renderDom.push({
                  name: 'text',
                  text: '['
                })
                temp = temp.slice(1)
              }
            }
            break
          case -1:
            renderDom.push({
              name: 'text',
              text: temp
            })
            temp = ''
            break
          default:
            renderDom.push({
              name: 'text',
              text: temp.slice(0, left)
            })
            temp = temp.substring(left)
            break
        }
      }
      return renderDom
    },
    firstWord(str) {
      return str.substr(0, 1)
    },
    toMap(point) {

    }
  }
}
</script>

<style scoped>
  .text {
    font-size: 13px;
  }

  .item {
    padding: 9px;
  }

  .item.current {
    background-color: #fafafa;
  }

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #efefef;
    font-size: 12px;
  }

  .name {
    font-size: 12px;
    color: #666666;
  }

  .time {
    font-size: 12px;
    color: #ccc;
  }

  .desc {
    font-size: 13px;
    margin-top: 5px;
    padding: 5px 8px;
    border-radius: 5px;
    background-color: #ffffff;
    line-height: 1.4;
  }

  .btn-load-history {
    text-align: center;
    padding: 10px;
    color: #4A9FF9;
    cursor: pointer;
  }

  .msg-address {
    max-width: 250px;
  }
  .msg-address .name {
    padding-bottom: 5px;
    font-size: 14px;
    color: #333333;
  }
  .msg-address .address {
    padding-bottom: 5px;
    font-size: 12px;
    color: #999999;
  }
  .msg-address .map {
    height: 150px;
  }

  .msg-img {
    width: 80px;
    height: 80px;
  }

  .input-box {
    padding: 10px;
    border-top: 1px solid #dddddd;
  }

  .btn-img {
    font-size: 32px;
    color: #666666;
    cursor: pointer;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .chat-plan {
    height: 500px;
    overflow-y: auto;
    background-color: #F8F8F8;
  }

  .chat-plan::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }

  .chat-plan::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    background-color: skyblue;
    background-image: -webkit-linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.2) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0.2) 75%,
      transparent 75%,
      transparent
    );
  }

  .chat-plan::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #ededed;
    border-radius: 10px;
  }
</style>
