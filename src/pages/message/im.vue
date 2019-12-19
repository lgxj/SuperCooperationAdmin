<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="8" :xs="12">
        <list :current-user-id="currentUserID" @toChat="toChat" />
      </el-col>

      <el-col v-if="user" :span="8" :xs="12">
        <chat :conversation-id="conversationID" :user="user" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import List from './components/List'
import Chat from './components/Chat'
export default {
  name: 'MessageIM',
  components: { List, Chat },
  data() {
    return {
      conversationID: '',
      currentUserID: '',
      user: null
    }
  },
  watch: {
    '$route.query'(val) {
      // 指定联系某人
      if (val.userID) {
        this.toUser(val.userID)
      }
    }
  },
  created() {
    if (this.$route.query.userID) {
      this.toUser(this.$route.query.userID)
    }
  },
  methods: {
    toChat(obj) {
      this.conversationID = obj.conversationID
      this.user = obj.user
    },
    toUser(userId) {
      this.currentUserID = userId
      this.$tim.getUserProfile({ userIDList: [userId] }).then(res => {
        this.conversationID = ''
        if (res.data[0]) {
          this.user = res.data[0]
        } else {
          this.currentUserID = ''
          this.user = null
          this.$message.error('用户不存在或未激活IM账户')
        }
      }).catch(err => {
        console.log('获取用户IM信息失败，', userId, err)
      })
    }
  }
}
</script>

<style scoped>

</style>
