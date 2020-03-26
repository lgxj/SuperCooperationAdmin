<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{ customerNick }} 的接待用户列表</span>
          </div>
          <users :user-id="customerId" @checked="checkedUser" />
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card v-if="messageId" class="box-card">
          <div slot="header" class="clearfix">
            <span>与 {{ userNick }} 的聊天记录</span>
          </div>
          <messages :message-id="messageId" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import table from '@/mixins/table'

import Users from './components/Users'
import Messages from './components/Messages'

export default {
  name: 'UserCustomerHistory',
  components: {
    Users,
    Messages
  },
  mixins: [
    table
  ],
  data() {
    return {
      customerId: '', // 客服ID
      customerNick: '', // 客服昵称
      userNick: '', // 当前查看的用户昵称
      messageId: '' // 当前查看的聊天记录ID
    }
  },
  created() {
    this.customerId = this.$route.params['id']
    this.customerNick = this.$route.params['name']
  },
  methods: {
    checkedUser(data) {
      this.messageId = data.message_id
      this.userNick = data.user.nick
    }
  }
}
</script>

<style scoped>

</style>
