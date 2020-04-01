<template>
  <div class="app-container">
    <el-form :inline="true" :model="search" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="search.user_id" placeholder="用户名/手机号" style="width: 150px;" class="filter-item" clearable />
      </el-form-item>
      <el-form-item>
        <el-input v-model="search.pay_no" placeholder="支付单号" style="width: 180px;" class="filter-item" clearable />
      </el-form-item>
      <el-form-item>
        <el-input v-model="search.biz_no" placeholder="业务单号" style="width: 250px;" class="filter-item" clearable />
      </el-form-item>
      <el-form-item>
        <el-input v-model="search.channel_trade_no" placeholder="第三方订单号" style="width: 250px;" class="filter-item" clearable />
      </el-form-item>
      <el-form-item label="创建时间：">
        <el-date-picker
          v-model="search.created_at"
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
      <el-table-column align="center" label="用户昵称(ID)" min-width="100">
        <template slot-scope="{row}">
          {{ row.user_name }}({{ row.user_id }})
        </template>
      </el-table-column>
      <el-table-column align="center" label="支付单号" min-width="170">
        <template slot-scope="{row}">
          {{ row.pay_no }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="支付说明" min-width="150">
        <template slot-scope="{row}">
          {{ row.body }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="业务单号" min-width="100">
        <template slot-scope="{row}">
          {{ row.biz_no }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="业务来源" min-width="100">
        <template slot-scope="{row}">
          {{ row.display_biz_source }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="业务子流水号" min-width="100">
        <template slot-scope="{row}">
          {{ row.biz_sub_no }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="支付方式" min-width="100">
        <template slot-scope="{row}">
          {{ row.display_channel }}({{ row.display_pay_type }})
        </template>
      </el-table-column>
      <el-table-column align="center" label="交易金额" min-width="100">
        <template slot-scope="{row}">
          {{ row.display_pay_price }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="支付手续费" min-width="100">
        <template slot-scope="{row}">
          {{ row.display_third_fee }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="平台服务费" min-width="100">
        <template slot-scope="{row}">
          {{ row.display_platform_fee }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="支付状态" min-width="100">
        <template slot-scope="{row}">
          {{ row.display_pay_state }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="第三方订单号" min-width="100">
        <template slot-scope="{row}">
          {{ row.channel_trade_no }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" min-width="100">
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
import { getList } from '@/api/account/pay'

export default {
  name: 'AccountPay',
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
        user_id: '',
        pay_no: '',
        biz_no: '',
        channel_trade_no: '',
        created_at: []
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
        user_id: '',
        pay_no: '',
        biz_no: '',
        channel_trade_no: '',
        created_at: []
      }
    }
  }
}
</script>

<style scoped>

</style>
