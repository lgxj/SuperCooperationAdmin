<template>
  <div class="app-container">
    <el-form :inline="true" :model="search" class="demo-form-inline">
      <el-form-item>
        <el-date-picker
          v-model="search.day"
          type="date"
          value-format="yyyyMMdd"
          placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        <el-button type="warning" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-divider class="mt0" />

    <el-table v-loading="tableLoading" :data="list" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="日期" min-width="100">
        <template slot-scope="{row}">
          {{ row.day }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="任务发布数" min-width="100">
        <template slot-scope="{row}">
          {{ row.publish_num }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="竞价任务发布数" min-width="120">
        <template slot-scope="{row}">
          {{ row.pubish_competition_num }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="任务支付数" min-width="100">
        <template slot-scope="{row}">
          {{ row.pay_num }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="接单数" min-width="100">
        <template slot-scope="{row}">
          {{ row.receive_num }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="交付数" min-width="100">
        <template slot-scope="{row}">
          {{ row.delivery_num }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="拒绝交付数" min-width="100">
        <template slot-scope="{row}">
          {{ row.refuse_delivery_num }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="完成数" min-width="100">
        <template slot-scope="{row}">
          {{ row.complete_num }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="确认帮手数" min-width="100">
        <template slot-scope="{row}">
          {{ row.confirm_receive_num }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="帮手取消数" min-width="100">
        <template slot-scope="{row}">
          {{ row.helper_cancel_num }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="雇主取消数" min-width="100">
        <template slot-scope="{row}">
          {{ row.employer_cancel_num }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="退款总数" min-width="100">
        <template slot-scope="{row}">
          {{ row.display_refund_total }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="提现总数" min-width="100">
        <template slot-scope="{row}">
          {{ row.display_withdraw_total }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="支付总数" min-width="100">
        <template slot-scope="{row}">
          {{ row.display_pay_total }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户注册数" min-width="100">
        <template slot-scope="{row}">
          {{ row.user_register }}
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="pagination" />

  </div>
</template>

<script>
import table from '@/mixins/table'
import { getList } from '@/api/statistics/task'

export default {
  name: 'TaskStatistics',
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
        day: ''
      }
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
        day: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
