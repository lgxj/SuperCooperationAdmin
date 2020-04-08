<template>
  <div class="app-container">
    <el-form :inline="true" :model="search" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="search.user_name" placeholder="用户名/手机号" style="width: 180px;" class="filter-item" clearable />
      </el-form-item>
      <el-form-item>
        <el-input v-model="search.withdraw_account" placeholder="提现账户" style="width: 250px;" class="filter-item" clearable />
      </el-form-item>
      <el-form-item>
        <el-input v-model="search.channel_trade_no" placeholder="第三方交易号" style="width: 250px;" class="filter-item" clearable />
      </el-form-item>
      <el-form-item>
        <el-input v-model="search.withdraw_no" placeholder="提现交易号" style="width: 250px;" class="filter-item" clearable />
      </el-form-item>
      <el-form-item>
        <el-select v-model="search.status" placeholder="状态" clearable style="width: 120px" class="filter-item">
          <el-option v-for="(item, index) in withdrawStatus" :key="index" :label="item" :value="index" />
        </el-select>
      </el-form-item>
      <el-form-item label="申请时间：">
        <el-date-picker
          v-model="search.create_time"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        <el-button type="warning" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-divider class="mt0" />

    <el-table v-loading="tableLoading" :data="list" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="记录ID" min-width="60">
        <template slot-scope="{row}">
          {{ row.withdraw_id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="交易号" min-width="170">
        <template slot-scope="{row}">
          {{ row.withdraw_no }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="提现用户昵称" min-width="150">
        <template slot-scope="{row}">
          {{ row.user_name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="提现用户头像" min-width="100">
        <template slot-scope="{row}">
          <el-image lazy :src="row.user_avatar" style="width: 70px; height: 70px" fit="cover" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="提现金额" min-width="100">
        <template slot-scope="{row}">
          {{ row.display_withdraw_money }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="手续费" min-width="100">
        <template slot-scope="{row}">
          {{ row.display_fee_money }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="转出重试次数" min-width="100">
        <template slot-scope="{row}">
          {{ row.retry_times }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="申请时间" min-width="150">
        <template slot-scope="{row}">
          {{ row.created_at }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="转账信息" min-width="230">
        <template slot-scope="{row}">
          <div>{{ row.display_withdraw_type }}</div>
          <div>{{ row.channel_trade_no }}</div>
          <div>{{ row.channel_pay_time }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态说明" min-width="100">
        <template slot-scope="{row}">
          {{ row.display_status }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="100">
        <template slot-scope="{row, $index}">
          <el-popover
            v-if="Number(row.status) === 0"
            v-model="row.dialogVisible"
            placement="top"
            width="180"
          >
            <p>您确定要通过审核吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="hideDialog(row)">取消</el-button>
              <el-button type="primary" size="mini" @click="handleExamine(row, $index)">确定</el-button>
            </div>
            <el-button slot="reference" type="primary" size="mini" plain>通过审核</el-button>
          </el-popover>
          <el-button v-if="Number(row.status) === 2" slot="reference" type="danger" size="mini" plain @click="handleRetry(row,$index)">重试</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="pagination" />

  </div>
</template>

<script>
import table from '@/mixins/table'
import { getList, verify, retry } from '@/api/account/index'
import { withdrawStatus } from '@/utils/const'

export default {
  name: 'AccountWithdraw',
  mixins: [
    table
  ],
  data() {
    return {
      listQuery: {
        limit: 10
      },
      list: [],
      search: {
        user_name: '',
        withdraw_account: '',
        channel_trade_no: '',
        withdraw_no: '',
        created_time: []
      },
      withdrawStatus,
      multipleSelection: []
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
    },
    /**
     * 重置筛选条件
     */
    handleReset() {
      this.search = {
        user_name: '',
        withdraw_account: '',
        channel_trade_no: '',
        withdraw_no: '',
        created_time: []
      }
    },
    /**
     * 取消审核
     * @param row
     */
    hideDialog(row) {
      row.dialogVisible = false
    },
    /**
     * 通过审核
     * @param row
     * @param index
     */
    handleExamine(row, index) {
      verify(row.user_id, row.withdraw_no).then(res => {
        this.$message.success('审核成功')
        this.hideDialog(row)
        this.$nextTick(() => {
          row.status = 1
        })
      })
    },
    /**
     * 重试审核
     * @param row
     * @param index
     */
    handleRetry(row, index) {
      retry(row.user_id, row.withdraw_no).then(res => {
        this.$message.success('审核成功')
        this.hideDialog(row)
        this.$nextTick(() => {
          row.status = 1
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
