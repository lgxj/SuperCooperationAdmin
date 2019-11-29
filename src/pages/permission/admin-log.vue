<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="search.keyword" placeholder="关键字搜索" style="width: 200px;" class="filter-item" clearable />
      <el-date-picker
        v-model="search.time"
        class="filter-item"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd HH:mm:ss"
        align="right"
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
    </div>

    <el-table v-loading="tableLoading" :data="list" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="用户" width="150">
        <template slot-scope="{row}">
          {{ row.admin.name }} ({{ row.admin.username }})
        </template>
      </el-table-column>
      <el-table-column align="center" label="类型" width="150">
        <template slot-scope="{row}">
          {{ row.type }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称" width="150">
        <template slot-scope="{row}">
          {{ row.title }}
        </template>
      </el-table-column>
      <el-table-column align="left" label="内容">
        <template slot-scope="{row}">
          {{ row.content }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="时间" width="150">
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

export default {
  name: 'PermissionAdminLog',
  mixins: [
    table
  ],
  data() {
    return {
      list: [],
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
      }
    }
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
