<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="search.keyword" placeholder="关键字搜索" style="width: 200px;" class="filter-item" clearable />
      <el-select v-model="search.category_id" placeholder="分类" clearable style="width: 150px" class="filter-item">
        <el-option v-for="(item, index) in category" :key="index" :label="item" :value="index" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleAdd">添加</el-button>
    </div>

    <el-table v-loading="tableLoading" :data="list" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="标题" min-width="200">
        <template slot-scope="{row}">
          {{ row.title }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="分类" min-width="120">
        <template slot-scope="{row}">
          {{ category[row.category_id] }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="作者" min-width="80">
        <template slot-scope="{row}">
          {{ row.author }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="阅读数" min-width="80">
        <template slot-scope="{row}">
          {{ row.hits }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="标签" min-width="100">
        <template slot-scope="{row}">
          {{ row.tag ? row.tag.join('、') : '' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="排序" min-width="80">
        <template slot-scope="{row}">
          {{ row.sort }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="160">
        <template slot-scope="{row, $index}">
          <el-button type="primary" size="mini" @click="handleEdit(row)">编辑</el-button>
          <el-popover
            v-model="row.dialogVisible"
            placement="top"
            width="180"
          >
            <p>您确定要删除此文章吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="hideDialog(row)">取消</el-button>
              <el-button type="primary" size="mini" @click="handleDelete(row, $index)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" size="mini" class="ml-10">删除</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="pagination" />
  </div>
</template>

<script>
import table from '@/mixins/table'
import { del, getList } from '@/api/article'
import { getDic as getCategoryDic } from '@/api/article-category'
import { listType } from '@/utils/const'

export default {
  name: 'ContentArticle',
  mixins: [
    table
  ],
  data() {
    return {
      list: [],
      listType,
      category: []
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.loadCategory()
      this.loadData()
    },
    loadCategory() {
      getCategoryDic().then(res => {
        this.category = res.data
      })
    },
    loadData() {
      getList(this.listQuery.page, this.listQuery.limit, JSON.stringify(this.search)).then(res => {
        this.loadedData(res)
      })
    },
    handleAdd() {
      this.$router.push({ name: 'ContentArticleAdd' })
    },
    handleEdit(row) {
      this.$router.push({ name: 'ContentArticleEdit', params: { id: row.article_id, name: row.title }})
    },
    hideDialog(row) {
      row.dialogVisible = false
    },
    handleDelete(row, index) {
      del(row.article_id).then(res => {
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
