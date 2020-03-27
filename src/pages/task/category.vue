<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAdd">新建分类</el-button>

    <el-table :data="list" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="ID" min-width="80">
        <template slot-scope="{row}">
          {{ row.category_id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称" min-width="150">
        <template slot-scope="{row}">
          {{ row.category_name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="排序" min-width="80">
        <template slot-scope="{row}">
          {{ row.sort }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="160">
        <template slot-scope="{row, $index}">
          <el-button type="primary" size="mini" @click="handleEdit(row, $index)">编辑</el-button>
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
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="pagination" />

    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" :close-on-click-modal="false">
      <el-form ref="dataForm" :model="info" :rules="rules" label-width="80px" label-position="left">
        <el-form-item label="名称" prop="category_name">
          <el-input v-model="info.category_name" placeholder="请输入名称" />
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
import { del, add, edit, getList } from '@/api/task/category'

export default {
  name: 'TaskCategory',
  mixins: [
    table
  ],
  data() {
    return {
      dialogVisible: false,
      dialogType: '',
      editIndex: '',
      list: [],
      info: {
        category_name: '',
        sort: '0'
      },
      rules: {
        category_name: [{ required: true, message: '请输入角色名', trigger: 'change' }]
      }
    }
  },
  computed: {
    dialogTitle() {
      return this.dialogType === 'update' ? '编辑分类' : '添加分类'
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
        category_id: '',
        category_name: '',
        sort: '0'
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
    handleEdit(row, index) {
      this.info = Object.assign({}, row) // copy obj
      this.dialogType = 'update'
      this.dialogVisible = true
      this.editIndex = index
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleSave() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dialogType === 'create') {
            add(this.info).then(res => {
              this.info.category_id = res.data.category_id
              this.list.unshift(Object.assign({}, this.info))
              this.$message.success('添加成功')
              this.dialogVisible = false
            })
          } else if (this.dialogType === 'update') {
            edit(this.info).then(res => {
              this.list.splice(this.editIndex, 1, this.info)
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
      del(row.category_id).then(res => {
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
