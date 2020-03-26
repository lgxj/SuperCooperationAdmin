<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="search.keyword" placeholder="关键字搜索" style="width: 200px;" class="filter-item" clearable />
      <el-select v-model="search.state" placeholder="在线状态" clearable style="width: 120px" class="filter-item">
        <el-option label="在线" value="1" />
        <el-option label="离线" value="2" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd">添加</el-button>
    </div>

    <el-table v-loading="tableLoading" :data="list" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="用户名">
        <template slot-scope="{row}">
          {{ row.user.user_name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="昵称">
        <template slot-scope="{row}">
          {{ row.nick }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="在线状态">
        <template slot-scope="{row}">
          {{ stateName(row.state) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="{row, $index}">
          <el-button type="info" size="mini" plain @click="toCustomerHistory(row)">接待记录</el-button>
          <el-popover
            v-model="row.dialogVisible"
            placement="top"
            width="180"
            class="ml-10"
          >
            <p>您确定要取消此客服身份吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="hideDialog(row)">取消</el-button>
              <el-button type="primary" size="mini" @click="handleCancel(row, $index)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" size="mini" plain>取消</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="pagination" />

    <el-dialog :visible.sync="dialogVisible" title="添加客服" :close-on-click-modal="false">
      <el-form ref="dataForm" :model="info" :rules="rules" label-width="80px" label-position="left">
        <el-form-item label="用户名" prop="user_name">
          <el-input v-model="info.user_name" placeholder="请输入用户名">
            <el-button slot="append" icon="el-icon-search" @click="handleFind" />
          </el-input>
        </el-form-item>
        <el-form-item label="" style="height: 50px">
          <el-checkbox v-if="search_user.user_id" v-model="checkUser" :label="search_user.user_name + '(' + search_user.nick + ')'" border />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" :disabled="!checkUser || !search_user.user_id" @click="handleSave">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import table from '@/mixins/table'
import { getList, search, add, cancel } from '@/api/user/customer'

export default {
  name: 'UserList',
  mixins: [
    table
  ],
  data() {
    return {
      list: [],
      dialogVisible: false,
      checkUser: true,
      info: {
        user_name: ''
      },
      search_user: {},
      rules: {
        user_name: [{ required: true, message: '请输入用户名', trigger: 'change' }]
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
    stateName(state) {
      switch (state) {
        case 'Login': return '在线'
        case 'Logout':
        case 'Disconnect':
        default:
          return '离线'
      }
    },
    hideDialog(row) {
      row.dialogVisible = false
    },
    // 重置表单信息
    resetInfo() {
      this.info = {
        user_name: ''
      }
      this.search_user = {
        user_name: '',
        nick: '',
        user_id: ''
      }
      this.$refs.tree && this.$refs.tree.setCheckedKeys([])
    },
    handleAdd() {
      this.resetInfo()
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleFind() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          search(this.info.user_name).then(res => {
            this.search_user = res.data
            this.checkUser = true
          })
        }
      })
    },
    handleSave() {
      if (!this.checkUser) {
        return this.$message.error('请搜索并选择用户')
      }
      add(this.search_user.user_id).then(res => {
        this.loadData()
        this.dialogVisible = false
      })
    },
    handleCancel(row, index) {
      cancel(row.user_id).then(res => {
        this.$message.success('取消成功')
        this.hideDialog(row)
        this.$nextTick(() => {
          this.list.splice(index, 1)
        })
      })
    },
    // 客户接待记录
    toCustomerHistory(row) {
      console.log(row)
      this.$router.push({ name: 'UserCustomerHistory', params: { id: row.user_id, name: row.nick }})
    }
  }
}
</script>

<style scoped>

</style>
