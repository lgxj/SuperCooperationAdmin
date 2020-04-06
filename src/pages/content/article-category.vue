<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAdd">新建分类</el-button>
    <el-button type="primary ml-10" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>

    <el-table v-loading="tableLoading" :data="list" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="分类名" min-width="150">
        <template slot-scope="{row}">
          {{ row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="列表样式" min-width="150">
        <template slot-scope="{row}">
          {{ listType[row.list_type] }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="文章数量" min-width="80">
        <template slot-scope="{row}">
          {{ row.articles_count }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="260">
        <template slot-scope="{row, $index}">
          <el-button type="primary" size="mini" @click="handleEdit(row)">编辑</el-button>
          <el-popover
            v-model="row.dialogVisible"
            placement="top"
            width="180"
          >
            <p>您确定要删除此分类吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="hideDialog(row)">取消</el-button>
              <el-button type="primary" size="mini" @click="handleDelete(row, $index)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" size="mini" class="ml-10">删除</el-button>
          </el-popover>
          <el-button size="mini" class="ml-10" @click="handlePreview(row)">查看H5</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="pagination" />
  </div>
</template>

<script>
import table from '@/mixins/table'
import { del, getList } from '@/api/article-category'
import { listType } from '@/utils/const'

export default {
  name: 'ContentArticleCategory',
  mixins: [
    table
  ],
  data() {
    return {
      list: [],
      listType
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
    handleAdd() {
      this.$router.push({ name: 'ContentArticleCategoryAdd' })
    },
    handleEdit(row) {
      this.$router.push({ name: 'ContentArticleCategoryEdit', params: { id: row.article_category_id, name: this.$filters.trim(row.name) }})
    },
    hideDialog(row) {
      row.dialogVisible = false
    },
    handleDelete(row, index) {
      del(row.article_category_id).then(res => {
        this.$message.success('删除成功')
        this.hideDialog(row)
        this.$nextTick(() => {
          this.list.splice(index, 1)
        })
      })
    },
    handlePreview(row) {
      window.open(this.$settings.webDomain + '/content/article?id=' + row.article_category_id, '_blank')
    }
  }
}
</script>

<style scoped>

</style>
