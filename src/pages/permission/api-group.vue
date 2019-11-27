<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAdd">新建分组</el-button>

    <el-table :data="list" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="分组名">
        <template slot-scope="{row}">
          {{ row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="排序" min-width="150">
        <template slot-scope="{row}">
          {{ row.sort }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="260">
        <template slot-scope="{row, $index}">
          <el-button type="primary" size="mini" @click="handleEdit(row)">编辑</el-button>
          <el-button type="primary" size="mini" @click="handleShowApi(row)">接口列表</el-button>
          <el-popover
            v-model="row.dialogVisible"
            placement="top"
            width="180"
          >
            <p>您确定要删除此分组吗？</p>
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
      <el-form ref="dataForm" :model="info" :rules="rules" label-width="80px" label-position="left">
        <el-form-item label="名称" prop="name">
          <el-input v-model="info.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="info.sort" placeholder="请输入排序" />
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
import { del, add, edit, getList } from '@/api/api-group'

export default {
  name: 'PermissionApiGroup',
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
        name: [{ required: true, message: '请输入名称', trigger: 'change' }],
        sort: [{ required: true, message: '请输入排序', trigger: 'change' }]
      }
    }
  },
  computed: {
    dialogTitle() {
      switch (this.dialogType) {
        case 'update':
          return '编辑分组'
        default:
          return '添加分组'
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
    // 重置表单信息
    resetInfo() {
      this.info = {
        name: '',
        sort: 0
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
              this.info.api_group_id = res.data.api_group_id
              this.list.unshift(Object.assign({}, this.info))
              this.$message.success('添加成功')
              this.dialogVisible = false
            })
          } else if (this.dialogType === 'update') {
            edit(this.info).then(res => {
              this.list = arrayReplace(this.list, 'api_group_id', this.info)
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
      del(row.api_group_id).then(res => {
        this.$message.success('删除成功')
        this.hideDialog(row)
        this.$nextTick(() => {
          this.list.splice(index, 1)
        })
      })
    },
    handleShowApi(row) {
      console.log(this.list)
      this.$router.push({ name: 'PermissionApi', params: { group_id: row.api_group_id, name: row.name }})
    }
  }
}
</script>

<style scoped>

</style>
