<template>
  <div class="app-container">
    <el-table :data="list" border style="width: 100%">
      <el-table-column prop="fee_rule_id" label="规则ID" width="180"></el-table-column>
      <el-table-column prop="fee_type" label="收费类型" width="180"></el-table-column>
      <el-table-column prop="name" label="规则名称"></el-table-column>
      <el-table-column prop="ratio" label="扣费比例"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="{row}">
          {{ globalState[row.state] }}
        </template>
      </el-table-column>
      <el-table-column prop="channel" label="支付渠道"></el-table-column>
      <el-table-column prop="biz_source" label="订单类型"></el-table-column>
      <el-table-column prop="created_at" label="创建时间"></el-table-column>
      <el-table-column prop="updated_at" label="修改时间"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import table from '@/mixins/table'
import { getList } from '@/api/account/fee'
import { globalState } from '@/utils/const'

export default {
  name: 'AccountCharge',
  mixins: [
    table
  ],
  data() {
    return {
      listQuery: {
        limit: 30
      },
      list: [],
      search: [],
      globalState
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.loadData()
    },
    loadData() {
      getList(this.listQuery.page, this.listQuery.limit, JSON.stringify(this.search)).then(res => {
        this.loadedData(res)
      })
    }
  }
}

</script>

<style scoped>

</style>
