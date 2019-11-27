<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAdd">新建角色</el-button>

    <el-table :data="list" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="角色名" min-width="150">
        <template slot-scope="{row}">
          {{ row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="编码" min-width="150">
        <template slot-scope="{row}">
          {{ row.code }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="备注">
        <template slot-scope="{row}">
          {{ row.remark }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="260">
        <template slot-scope="{row, $index}">
          <el-button type="primary" size="mini" @click="handleEdit(row, 'update')">编辑</el-button>
          <el-button type="warning" size="mini" @click="handleEdit(row, 'resource')">修改权限</el-button>
          <el-popover
            v-model="row.dialogVisible"
            placement="top"
            width="180"
          >
            <p>您确定要删除此角色吗？</p>
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
        <el-form-item v-if="dialogType !== 'resource'" label="名称" prop="name">
          <el-input v-model="info.name" placeholder="请输入角色名" />
        </el-form-item>
        <el-form-item v-if="dialogType !== 'resource'" label="编码" prop="code">
          <el-input v-model="info.code" placeholder="请输入角色编码" />
        </el-form-item>
        <el-form-item v-if="dialogType !== 'resource'" label="备注" prop="remark">
          <el-input
            v-model="info.remark"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="角色说明备注"
          />
        </el-form-item>
        <el-form-item v-if="dialogType !== 'update'" label="权限" prop="resourceIds">
          <el-tree
            ref="tree"
            v-model="info.resourceIds"
            :check-strictly="checkStrictly"
            :data="resources"
            :props="defaultProps"
            show-checkbox
            node-key="resource_id"
            class="permission-tree"
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
import { del, add, edit, editResource, getList } from '@/api/role'
import { getTree as getResources } from '@/api/resource'

const tmpResources = [{
  value: 'zhinan',
  label: '指南',
  children: [{
    value: '10',
    label: '设计原则',
    children: [{
      value: '1',
      label: '一致'
    }, {
      value: '2',
      label: '反馈'
    }, {
      value: '3',
      label: '效率'
    }, {
      value: '4',
      label: '可控'
    }]
  }, {
    value: 'daohang',
    label: '导航',
    children: [{
      value: '5',
      label: '侧向导航'
    }, {
      value: '6',
      label: '顶部导航'
    }]
  }]
}]

export default {
  name: 'PermissionRole',
  mixins: [
    table
  ],
  data() {
    return {
      dialogVisible: false,
      dialogType: '',
      roles: [],
      resources: tmpResources,
      list: [],
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'name',
        value: 'resource_id'
      },
      info: {},
      rules: {
        name: [{ required: true, message: '请输入角色名', trigger: 'change' }],
        code: [{ required: true, message: '请输入编码', trigger: 'change' }]
      }
    }
  },
  computed: {
    dialogTitle() {
      switch (this.dialogType) {
        case 'update':
          return '编辑角色'
        case 'resource':
          return '修改权限'
        default:
          return '添加角色'
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.loadResource()
      this.loadData()
    },
    loadResource() {
      getResources(0, true).then(res => {
        this.resources = res.data
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
        code: '',
        remark: '',
        resourceIds: []
      }
      this.$refs.tree && this.$refs.tree.setCheckedKeys([])
    },
    handleAdd() {
      this.resetInfo()
      this.dialogType = 'create'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleEdit(row, type) {
      this.info = Object.assign({}, row) // copy obj
      this.dialogType = type
      this.dialogVisible = true
      this.$nextTick(() => {
        if (type === 'resource') {
          this.$refs.tree.setCheckedKeys(row.resourceIds, true)
        }
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleSave() {
      this.info.resourceIds = this.$refs.tree ? this.$refs.tree.getCheckedKeys(true) : []
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dialogType === 'create') {
            add(this.info).then(res => {
              this.info.role_id = res.data.role_id
              this.list.unshift(Object.assign({}, this.info))
              this.$message.success('添加成功')
              this.dialogVisible = false
            })
          } else if (this.dialogType === 'update') {
            edit(this.info).then(res => {
              this.list = arrayReplace(this.list, 'role_id', this.info)
              this.$message.success('编辑成功')
              this.dialogVisible = false
            })
          } else if (this.dialogType === 'resource') {
            editResource(this.info).then(res => {
              this.$message.success('修改权限成功')
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
      del(row.role_id).then(res => {
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
