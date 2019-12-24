<template>
  <el-card class="box-card" :body-style="{ padding: '0' }">
    <div slot="header" class="clearfix">
      <span>消息列表</span>
      <!--<el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
    </div>
    <div v-if="list.length">
      <div v-for="(item, index) in list" :key="index" class="text item flex" :class="{current: current === index}" @click="toChat(item)">
        <div class="flex-none">
          <el-badge :value="item.unreadCount" :hidden="item.unreadCount === 0">
            <el-image
              class="avatar"
              :src="item.userProfile.avatar"
              fit="cover"
            >
              <div slot="error" class="flex flex-align-center image-error" style="height: 100%">
                <div class="flex-auto text-center" style="font-size: 16px">{{ firstWord(item.userProfile.nick) }}</div>
              </div>
            </el-image>
          </el-badge>
        </div>
        <div class="flex-auto pl-20" style="min-width: 0">
          <div class="title">
            <div class="time float-right">{{ formatTime(item.lastMessage.lastTime) }}</div>
            <div class="name">{{ item.userProfile.nick }}</div>
          </div>
          <div class="desc text-line mt-10">{{ item.lastMessage.messageForShow }}</div>
        </div>
      </div>
    </div>
    <div v-else class="empty">
      暂无数据
    </div>
  </el-card>
</template>

<script>
import { formatTime } from '@/utils'
import TIM from 'tim-js-sdk'

export default {
  name: 'List',
  props: {
    currentUserId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      current: -1,
      list: [],
      users: {}
    }
  },
  created() {
    if (this.$tim.ready) {
      this.getConversationList()
    } else {
      this.$tim.on(TIM.EVENT.SDK_READY, _ => {
        this.getConversationList()
      })
    }
    // 会话列表更新
    this.$tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, event => {
      this.list = event.data
    })
  },
  methods: {
    getConversationList() {
      this.$tim.getConversationList().then(res => {
        this.list = res.data.conversationList
        this.list.map(item => {
          if (item.userProfile.userID === this.currentUserId) {
            this.toChat(item)
          }
        })
      })
    },
    formatTime(time) {
      return formatTime(time)
    },
    toChat(item) {
      this.$emit('toChat', item)
    },
    searchByUser(userId) {
      let res = false
      this.list.map(item => {
        if (item.userProfile.userID === userId) {
          res = item
        }
      })
      return res
    },
    firstWord(str) {
      return str.substr(0, 1)
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

  .time {
    font-size: 12px;
    color: #ccc;
  }

  .desc {
    font-size: 12px;
    color: #999;
  }

  .item + .item {
    border-top: 1px solid #eeeeee;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .empty {
    padding: 50px;
    text-align: center;
    color: #666666;
    font-size: 12px;
  }
</style>
