<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="search.keyword" placeholder="关键字搜索" style="width: 200px;" class="filter-item" clearable />
      <el-select v-model="search.group_id" placeholder="分组" clearable style="width: 180px" class="filter-item">
        <el-option v-for="(item, index) in apiGroup" :key="index" :label="item" :value="index" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleAdd">新建接口</el-button>
    </div>

    <el-table v-loading="tableLoading" :data="listSort" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="所属分组" min-width="120">
        <template slot-scope="{row}">
          {{ apiGroup[row.group_id] || '' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="接口名" min-width="150">
        <template slot-scope="{row}">
          {{ row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="地址" min-width="200">
        <template slot-scope="{row}">
          {{ row.path }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="请求方式" min-width="100">
        <template slot-scope="{row}">
          {{ row.method }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" min-width="80">
        <template slot-scope="{row}">
          {{ globalStatusDis[row.status] }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="需要登录" min-width="100">
        <template slot-scope="{row}">
          {{ globalYesNo[row.is_login] }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="开发中" min-width="100">
        <template slot-scope="{row}">
          {{ globalYesNo[row.is_dev] }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="排序" min-width="80">
        <template slot-scope="{row}">
          {{ row.sort }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="备注" min-width="120">
        <template slot-scope="{row}">
          {{ row.remark }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="180">
        <template slot-scope="{row, $index}">
          <el-button type="primary" size="mini" @click="handleEdit(row, 'update')">编辑</el-button>
          <el-popover
            v-model="row.dialogVisible"
            placement="top"
            width="180"
          >
            <p>您确定要删除此接口吗？</p>
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

    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" :close-on-click-modal="false">
      <el-form ref="dataForm" :model="info" :rules="rules" label-width="100px" label-position="left">
        <el-form-item label="所属分组" prop="group_id">
          <el-select v-model="info.group_id" placeholder="请选择分组" clearable>
            <el-option v-for="(item, index) in apiGroup" :key="index" :label="item" :value="index" />
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="info.name" placeholder="请输入接口名" />
        </el-form-item>
        <el-form-item label="地址" prop="path">
          <el-input v-model="info.path" placeholder="请输入接口城址" />
        </el-form-item>
        <el-form-item label="请求方式" prop="method">
          <el-select v-model="info.method" placeholder="请选择请求方式" clearable>
            <el-option v-for="(item, index) in apiMethod" :key="index" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否启用" prop="status">
          <el-switch
            v-model="info.status"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item label="需要登录" prop="is_login">
          <el-switch
            v-model="info.is_login"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item label="开发中" prop="is_dev">
          <el-switch
            v-model="info.is_dev"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="info.sort" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="info.remark"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="接口说明备注"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import table from '@/mixins/table'
import { arrayReplace } from '@/utils'
import { del, add, edit, getList } from '@/api/api-back'
import { getDic as getGroupDic } from '@/api/api-group'
import { apiMethod, globalStatusDis, globalYesNo } from '@/utils/const'

export default {
  name: 'PermissionApi',
  mixins: [
    table
  ],
  data() {
    return {
      dialogVisible: false,
      dialogType: '',
      list: [],
      info: {},
      rules: {
        name: [{ required: true, message: '请输入接口名', trigger: 'change' }],
        path: [{ required: true, message: '请输入地址', trigger: 'change' }],
        method: [{ required: true, message: '请选择请求方式', trigger: 'change' }],
        group_id: [{ required: true, message: '请选择所属分组', trigger: 'change' }]
      },
      search: {
        group_id: '',
        keyword: ''
      },
      apiMethod,
      globalStatusDis,
      globalYesNo,
      apiGroup: []
    }
  },
  computed: {
    dialogTitle() {
      switch (this.dialogType) {
        case 'update':
          return '编辑接口'
        default:
          return '添加接口'
      }
    },
    listSort() {
      return [].concat(this.list).sort((a, b) => {
        if (a.group_id === b.group_id) {
          if (a.sort === b.sort) return 0
          return a.sort > b.sort ? 1 : -1
        } else {
          return a.group_id > b.group_id ? 1 : -1
        }
      })
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.search.group_id = String(this.$route.params.group_id || '')
      this.loadGroup()
      this.loadData()
    },
    loadGroup() {
      getGroupDic().then(res => {
        this.apiGroup = res.data
      })
    },
    loadData() {
      getList(this.listQuery.page, this.listQuery.limit, JSON.stringify(this.search)).then(res => {
        this.loadedData(res)
      })
    },
    // 重置表单信息
    resetInfo() {
      this.info = {
        name: '',
        path: '',
        method: '',
        group_id: '',
        status: 1,
        is_dev: 0,
        sort: 0,
        remark: ''
      }
    },
    handleAdd() {
      this.resetInfo()
      this.dialogType = 'create'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleEdit(row) {
      this.info = Object.assign({}, row) // copy obj
      this.info.group_id = String(this.info.group_id)
      this.dialogType = 'update'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleSave() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dialogType === 'create') {
            add(this.info).then(res => {
              this.info.api_id = res.data.api_id
              this.list.unshift(Object.assign({}, this.info))
              this.$message.success('添加成功')
              this.dialogVisible = false
            })
          } else if (this.dialogType === 'update') {
            edit(this.info).then(res => {
              this.list = arrayReplace(this.list, 'api_id', this.info)
              this.$message.success('编辑成功')
              this.dialogVisible = false
            })
          }
        }
      })
    },
    hideDialog(row) {
      row.dialogVisible = false
    },
    handleDelete(row, index) {
      del(row.api_id).then(res => {
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
