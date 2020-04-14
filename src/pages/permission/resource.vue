<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAdd">添加功能</el-button>

    <el-table
      ref="table"
      :data="list"
      style="width: 100%;margin-top:30px;margin-bottom: 20px;"
      row-key="resource_id"
      border
      lazy
      :load="loadChild"
      :tree-props="{children: 'children', hasChildren: 'child_count'}"
    >
      <el-table-column align="left" label="功能名" min-width="220">
        <template slot-scope="{row}">
          {{ row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="编码" min-width="180">
        <template slot-scope="{row}">
          {{ row.code }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="类型" min-width="150">
        <template slot-scope="{row}">
          {{ globalResourceType[row.type] }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" min-width="80">
        <template slot-scope="{row}">
          {{ globalStatusDis[row.status] }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属系统" min-width="180">
        <template slot-scope="{row}">
          {{ formatSystem(row) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否开发中" min-width="100">
        <template slot-scope="{row}">
          {{ globalYesNo[row.is_dev] }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="排序" min-width="80">
        <template slot-scope="{row}">
          {{ row.sort }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="160">
        <template slot-scope="{row, $index}">
          <el-button type="primary" size="mini" @click="handleEdit(row, 'update')">编辑</el-button>
          <el-popover
            v-model="row.dialogVisible"
            placement="top"
            width="180"
          >
            <p>您确定要删除此功能吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="hideDialog(row)">取消</el-button>
              <el-button type="primary" size="mini" @click="handleDelete(row, $index)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" size="mini" class="ml-10">删除</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" :close-on-click-modal="false">
      <el-form ref="dataForm" :rules="rules" :model="info" label-width="100px" label-position="left">
        <el-form-item label="所属上级">
          <el-cascader
            ref="fid"
            v-model="info.fid"
            :options="resources"
            placeholder="不选为顶级"
            :props="{ checkStrictly: true, value: 'resource_id', label: 'name' }"
            clearable
          />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="info.name" placeholder="请输入功能名" />
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="info.code" placeholder="请输入功能编码" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="info.type" placeholder="请选择功能类型" class="filter-item">
            <el-option v-for="(item, index) in globalResourceType" :key="index" :label="item" :value="index" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属系统">
          <el-select v-model="info.systemIds" multiple placeholder="请选择所属系统" filterable clearable class="w100">
            <el-option v-for="(item, index) in systems" :key="index" :label="item" :value="index" />
          </el-select>
        </el-form-item>
        <el-form-item label="依赖API">
          <el-select v-model="info.apiIds" multiple placeholder="请选择依赖API" filterable clearable class="w100">
            <el-option-group
              v-for="group in apis"
              :key="group.api_group_id"
              :label="group.name"
            >
              <el-option
                v-for="item in group.apis"
                :key="item.api_id"
                :label="item.name"
                :value="item.api_id"
              />
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="是否启用" prop="status">
          <el-switch
            v-model="info.status"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item label="是否开发中" prop="is_dev">
          <el-switch
            v-model="info.is_dev"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="info.sort" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="info.remark"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="功能说明备注"
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
import { arrayReplace, arraySplice, deepClone } from '@/utils'
import { del, add, edit, editApi, getTree } from '@/api/resource'
import { getTree as getApiTree } from '@/api/api-group'
import { getDic as getSystemDic } from '@/api/system'
import { globalResourceType, globalStatusDis, globalYesNo } from '@/utils/const'

export default {
  name: 'PermissionResource',
  mixins: [
    table
  ],
  data() {
    return {
      dialogVisible: false,
      dialogType: '',
      apis: [],
      systems: [],
      resources: [],
      list: [],
      info: {},
      currentInfo: {},
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      rules: {
        name: [{ required: true, message: '请输入功能名', trigger: 'change' }],
        code: [{ required: true, message: '请输入编码', trigger: 'change' }],
        type: [{ required: true, message: '请选择类型', trigger: 'change' }],
        systemIds: [{ required: true, message: '请选择所属系统', trigger: 'change' }]
      },
      globalResourceType,
      globalStatusDis,
      globalYesNo,
      maps: new Map()
    }
  },
  computed: {
    dialogTitle() {
      switch (this.dialogType) {
        case 'update':
          return '编辑功能'
        default:
          return '添加功能'
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    formatSystem(row) {
      if (!row.systems) return '-'
      return deepClone(row.systems).map(item => {
        return item.system_name
      }).join('、')
    },
    init() {
      this.loadTree()
      this.getSystemDic()
      this.loadApiTree()
      this.loadData()
    },
    loadTree() {
      getTree(0, 1).then(res => {
        this.resources = this.formatTreeData(res.data)
      })
    },
    formatTreeData(data) {
      return data.map(item => {
        if (!item.children.length) {
          delete item.children
        } else {
          item.children = this.formatTreeData(item.children)
        }
        return item
      })
    },
    getSystemDic() {
      getSystemDic().then(res => {
        this.systems = res.data
      })
    },
    loadApiTree() {
      getApiTree().then(res => {
        this.apis = res.data
      })
    },
    loadData() {
      getTree(0, 0).then(res => {
        this.list = this.formatData(res.data)
      })
    },
    loadChild(tree, treeNode, resolve) {
      getTree(tree.resource_id, 0).then(res => {
        const pid = tree.resource_id
        this.maps.set(pid, { tree, treeNode, resolve })
        resolve(this.formatData(res.data))
      })
    },
    formatData(data) {
      return data.map(item => {
        item.apiIds = item.apis.map(subItem => {
          return subItem.api_id
        })
        item.systemIds = item.systems.map(subItem => {
          return String(subItem.system_id)
        })
        item.type = String(item.type)
        return item
      })
    },
    // 重置表单信息
    resetInfo() {
      this.info = {
        name: '',
        code: '',
        remark: '',
        fid: 0,
        type: 1,
        sort: 0,
        status: 1,
        is_dev: 0,
        apiIds: [],
        systemIds: []
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
    handleEdit(row, type) {
      this.currentInfo = row
      this.info = Object.assign({}, row) // copy obj
      this.dialogType = type
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleSave() {
      if (typeof this.info.fid === 'object') {
        this.info.fid = this.info.fid[this.info.fid.length - 1]
      }
      this.info.fid = this.info.fid || 0
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dialogType === 'create') {
            this.info.fid = 3
            add(this.info).then(res => {
              this.info.resource_id = res.data.resource_id
              this.addToTable()
              this.$message.success('添加成功')
              this.dialogVisible = false
            })
          } else if (this.dialogType === 'update') {
            edit(this.info).then(res => {
              this.updateToTable()
              this.$message.success('编辑成功')
              this.dialogVisible = false
            })
          } else if (this.dialogType === 'api') {
            editApi(this.info).then(res => {
              this.$message.success('修改依赖API成功')
              this.dialogVisible = false
            })
          }
        }
      })
    },
    addToTable() {
      const { fid } = this.info
      if (fid) {
        const obj = this.maps.get(fid)
        if (obj) {
          this.updateTreeNode(fid)
        }
      } else {
        this.list.unshift(Object.assign({}, this.info))
      }
      return this.loadData()
    },
    updateToTable() {
      const { fid } = this.info
      const old_fid = this.currentInfo.fid
      if (fid) {
        const obj = this.maps.get(fid)
        if (obj) {
          this.updateTreeNode(fid)
        }
      } else {
        this.list = arrayReplace(this.list, 'resource_id', this.info, true)
      }
      if (old_fid !== fid) {
        if (old_fid) {
          this.updateTreeNode(old_fid)
        } else {
          this.list = arraySplice(this.list, 'resource_id', this.currentInfo)
        }
      }
      return this.loadData()
    },
    updateTreeNode(fid) {
      const { tree, treeNode, resolve } = this.maps.get(fid)
      this.$set(this.$refs.table.store.states.lazyTreeNodeMap, fid, [])
      this.loadChild(tree, treeNode, resolve)
    },
    hideDialog(row) {
      row.dialogVisible = false
    },
    handleDelete(row, index) {
      del(row.resource_id).then(res => {
        this.$message.success('删除成功')
        this.hideDialog(row)
        this.$nextTick(() => {
          const { fid } = row
          if (fid) {
            this.updateTreeNode(fid)
          } else {
            this.list.splice(index, 1)
          }
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
