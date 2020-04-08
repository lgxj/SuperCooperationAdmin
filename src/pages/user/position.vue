<template>
  <div class="app-container">
    <!-- 筛选 -->
    <div class="filter-container">
      <el-input v-model="search.user_id" placeholder="用户名" style="width: 200px;" class="filter-item" clearable />
      <el-date-picker
        v-model="search.updated_at"
        class="filter-item"
        type="datetimerange"
        :picker-options="datetimeRangePickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd HH:mm:ss"
        align="right"
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="list" border style="width: 100%">
      <el-table-column prop="id" label="标识ID" width="100"></el-table-column>
      <el-table-column prop="user_name" label="用户" width="180"></el-table-column>
      <el-table-column prop="province" label="省份" width="120"></el-table-column>
      <el-table-column prop="city" label="市"></el-table-column>
      <el-table-column prop="region" label="区"></el-table-column>
      <el-table-column prop="street" label="街道"></el-table-column>
      <el-table-column prop="address_detail" label="详细地址"></el-table-column>
      <el-table-column prop="lng" label="经度" width="100"></el-table-column>
      <el-table-column prop="lat" label="纬度" width="100"></el-table-column>
      <el-table-column prop="updated_at" label="修改时间"></el-table-column>
    </el-table>
  </div>
</template>

<script>

import table from '@/mixins/table'
import { getPositionSearch } from '@/api/user/user'
import { datetimeRangePickerOptions } from '@/utils/const'

export default {
  name: 'UserPosition',
  mixins: [
    table
  ],
  data() {
    return {
      listQuery: {
        limit: 10
      },
      list: [],
      datetimeRangePickerOptions,
      search: {}
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
      getPositionSearch(this.listQuery.page, this.listQuery.limit, JSON.stringify(this.search)).then(res => {
        this.loadedData(res)
      })
    }
  }
}
</script>

<style scoped>

</style>
