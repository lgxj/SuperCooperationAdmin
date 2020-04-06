<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="search.keyword" placeholder="关键字搜索" style="width: 200px;" class="filter-item" clearable />
      <el-date-picker
        v-model="search.time"
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

    <el-table v-loading="tableLoading" :data="list" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="用户" min-width="150">
        <template slot-scope="{row}">
          {{ row.admin.name }} ({{ row.admin.username }})
        </template>
      </el-table-column>
      <el-table-column align="center" label="类型" min-width="150">
        <template slot-scope="{row}">
          {{ row.type }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称" min-width="150">
        <template slot-scope="{row}">
          {{ row.title }}
        </template>
      </el-table-column>
      <el-table-column align="left" label="内容">
        <template slot-scope="{row}">
          {{ row.content }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="时间" min-width="150">
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
import { getLogList } from '@/api/admin'
import { datetimeRangePickerOptions } from '@/utils/const'

export default {
  name: 'PermissionAdminLog',
  mixins: [
    table
  ],
  data() {
    return {
      list: [],
      datetimeRangePickerOptions
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.search.admin_id = this.$route.params.id || ''
      this.loadData()
    },
    loadData() {
      getLogList(this.listQuery.page, this.listQuery.limit, JSON.stringify(this.search)).then(res => {
        this.loadedData(res)
      })
    }
  }
}
</script>

<style scoped>

</style>
