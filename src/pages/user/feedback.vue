<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="search.keyword" placeholder="关键字搜索" style="width: 200px;" class="filter-item" clearable />
      <el-select v-model="search.feedback_type" placeholder="类型" clearable style="width: 150px" class="filter-item">
        <el-option v-for="(item, index) in feedbackTypes" :key="index" :label="item" :value="index" />
      </el-select>
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
      <el-table-column align="center" label="ID" min-width="60">
        <template slot-scope="{row}">
          {{ row.feedback_id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="类型" min-width="120">
        <template slot-scope="{row}">
          {{ feedbackTypes[row.feedback_type] }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户" min-width="120">
        <template slot-scope="{row}">
          {{ row.user ? row.user.user_name : '' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="内容" min-width="200">
        <template slot-scope="{row}">
          {{ row.feedback_desc }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="图片" min-width="100">
        <template slot-scope="{row}">
          <div v-if="row.feedback_images">
            <el-image v-for="(item, index) in JSON.parse(row.feedback_images)" :key="index" lazy :src="item" style="width: 70px; height: 70px" fit="scale-down" :class="{'ml-10': index > 0 }" :preview-src-list="JSON.parse(row.feedback_images)" />
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="反馈时间" min-width="160">
        <template slot-scope="{row}">
          {{ row.created_at }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="100">
        <template slot-scope="{row, $index}">
          <el-popover
            v-model="row.dialogVisible"
            placement="top"
            width="180"
          >
            <p>您确定要删除此反馈吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="hideDialog(row)">取消</el-button>
              <el-button type="primary" size="mini" @click="handleDelete(row, $index)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" size="mini">删除</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="pagination" />
  </div>
</template>

<script>
import table from '@/mixins/table'
import { del, getList, getFeedbackTypes } from '@/api/user/feedback'
import { datetimeRangePickerOptions } from '@/utils/const'

export default {
  name: 'UserFeedback',
  mixins: [
    table
  ],
  data() {
    return {
      list: [],
      feedbackTypes: [],
      category: [],
      datetimeRangePickerOptions
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.loadFeedbackTypes()
      this.loadData()
    },
    loadFeedbackTypes() {
      getFeedbackTypes().then(res => {
        this.feedbackTypes = res.data
      })
    },
    loadData() {
      getList(this.listQuery.page, this.listQuery.limit, JSON.stringify(this.search)).then(res => {
        this.loadedData(res)
      })
    },
    hideDialog(row) {
      row.dialogVisible = false
    },
    handleDelete(row, index) {
      del(row.feedback_id).then(res => {
        this.$message.success('删除成功')
        this.hideDialog(row)
        this.$nextTick(() => {
          this.list.splice(index, 1)
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
