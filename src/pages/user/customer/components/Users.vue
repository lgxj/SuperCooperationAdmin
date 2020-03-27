<template>
  <div>
    <el-table v-loading="tableLoading" :data="list" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="昵称" min-width="100">
        <template slot-scope="{row}">
          {{ row.user.nick }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="最后联系时间" min-width="160">
        <template slot-scope="{row}">
          {{ row.updated_at }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="110">
        <template slot-scope="{row}">
          <el-button type="info" size="mini" plain @click="toMsg(row)">查看记录</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="pagination" />
  </div>
</template>

<script>
import table from '@/mixins/table'
import { getServiceUserList } from '@/api/user/customer'

export default {
  name: 'UserCustomerHistoryUsers',
  mixins: [
    table
  ],
  props: {
    userId: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
    }
  },
  watch: {
    userId() {
      this.loadData()
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      getServiceUserList(this.userId, this.listQuery.page, this.listQuery.limit).then(res => {
        this.loadedData(res)
      })
    },
    toMsg(row) {
      this.$emit('checked', row)
    }
  }
}
</script>

<style scoped>

</style>
