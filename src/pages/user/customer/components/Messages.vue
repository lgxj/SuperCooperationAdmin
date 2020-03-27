<template>
  <div>
    <el-table v-loading="tableLoading" :data="list" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="发送者" min-width="120">
        <template slot-scope="{row}">
          {{ row.user_name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="内容" min-width="200">
        <template slot-scope="{row}">
          <span v-if="row.title === 'address'"><el-image class="map" :src="row.content" fit="cover" /></span>
          <span v-else-if="row.title === 'pic'"><el-image class="photo" :src="row.content" fit="cover" /></span>
          <span v-else>{{ row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="时间" min-width="160">
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
  .map {
    width: 100px;
  }
  .phone {
    max-width: 200px;
  }
</style>
