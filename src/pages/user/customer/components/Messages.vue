<template>
  <div>
    <el-table v-loading="tableLoading" :data="list" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="发送者">
        <template slot-scope="{row}">
          {{ row.user_name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="内容">
        <template slot-scope="{row}">
          {{ row.content }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="时间">
        <template slot-scope="{row}">
          {{ row.created_at }}
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="pagination" />
  </div>
</template>

<script>
import table from '@/mixins/table'
import { getServiceMsgList } from '@/api/user/customer'

export default {
  name: 'UserCustomerHistoryMessages',
  mixins: [
    table
  ],
  props: {
    messageId: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      order: 'desc'
    }
  },
  watch: {
    messageId() {
      this.loadData()
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      if (!this.messageId) return
      getServiceMsgList(this.messageId, this.order, this.listQuery.page, this.listQuery.limit).then(res => {
        this.loadedData(res)
      })
    }
  }
}
</script>

<style scoped>

</style>
