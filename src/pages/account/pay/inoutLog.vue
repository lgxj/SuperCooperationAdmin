<template>
  <div class="app-container">
    <el-form :inline="true" :model="search" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="search.user_id" placeholder="用户名/手机号" style="width: 150px;" class="filter-item" clearable />
      </el-form-item>
      <el-form-item>
        <el-input v-model="search.water_no" placeholder="流水号" style="width: 250px;" class="filter-item" clearable />
      </el-form-item>
      <el-form-item>
        <el-input v-model="search.biz_no" placeholder="业务单号" style="width: 250px;" class="filter-item" clearable />
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
      <el-table-column align="center" label="流水号" min-width="110">
        <template slot-scope="{row}">
          {{ row.water_no }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="金额" min-width="80">
        <template slot-scope="{row}">
          {{ row.display_money }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="可用余额" min-width="80">
        <template slot-scope="{row}">
          {{ row.display_available_balance }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="流水类型" min-width="100">
        <template slot-scope="{row}">
          {{ row.display_in_out_type }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="业务单号" min-width="120">
        <template slot-scope="{row}">
          {{ row.biz_no }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="业务来源" min-width="80">
        <template slot-scope="{row}">
          {{ row.display_biz_source }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="关联流水号" min-width="120">
        <template slot-scope="{row}">
          {{ row.relation_water_no }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="资金去向" min-width="50">
        <template slot-scope="{row}">
          {{ row.from_to }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="资金渠道" min-width="80">
        <template slot-scope="{row}">
          {{ row.display_channel }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" min-width="120">
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
import { getList } from '@/api/account/inoutLog'

export default {
  name: 'AccountPayInoutLog',
  mixins: [
    table
  ],
  data() {
    return {
      list: [],
      search: {
        user_id: '',
        water_no: '',
        biz_no: ''
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
        water_no: '',
        biz_no: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
