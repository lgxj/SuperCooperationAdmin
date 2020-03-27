<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAdd">新建</el-button>

    <el-tabs class="mt-10" @tab-click="handleTabChange">
      <el-tab-pane v-for="(item, index) in group" :key="index" :label="item.label">
        <el-table v-loading="tableLoading" :data="groupList(item.value)" style="width: 100%;margin-top:30px;" border highlight-current-row>
          <el-table-column align="center" label="名称" min-width="120">
            <template slot-scope="{row}">
              {{ row.config_name }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="Key" min-width="120">
            <template slot-scope="{row}">
              {{ row.config_key }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="值" min-width="120">
            <template slot-scope="{row}">
              <el-image v-if="row.config_type === 'img'" lazy :src="getImgFullPath(row.config_value)" style="width: 70px; height: 70px" fit="scale-down" />
              <template v-else>{{ formatValue(row) }}</template>
            </template>
          </el-table-column>
          <el-table-column align="center" label="扩展信息" min-width="250">
            <template slot-scope="{row}">
              {{ row.config_extra }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="说明" min-width="250">
            <template slot-scope="{row}">
              {{ row.config_desc }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" min-width="240">
            <template slot-scope="{row}">
              <el-button type="primary" size="mini" @click="handleEdit(row, 'setValue')">修改值</el-button>
              <el-button type="primary" size="mini" @click="handleEdit(row, 'update')">编辑</el-button>
              <el-popover
                v-model="row.dialogVisible"
                placement="top"
                width="180"
              >
                <p>您确定要删除此配置项吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="hideDialog(row)">取消</el-button>
                  <el-button type="primary" size="mini" @click="handleDelete(row)">确定</el-button>
                </div>
                <el-button slot="reference" type="danger" size="mini" class="ml-10">删除</el-button>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" :close-on-click-modal="false">
      <el-form ref="dataForm" :model="info" :rules="rules" label-width="80px" label-position="left">
        <el-form-item v-if="dialogType !== 'setValue'" label="名称" prop="config_name">
          <el-input v-model="info.config_name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item v-if="dialogType !== 'setValue'" label="Key" prop="config_key">
          <el-input v-model="info.config_key" placeholder="请输入Key" />
        </el-form-item>
        <el-form-item v-if="dialogType !== 'setValue'" label="值类型" prop="config_type">
          <el-select v-model="info.config_type" placeholder="请选择值类型" clearable>
            <el-option
              v-for="(item, index) in type"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="dialogType === 'setValue' ? info.config_name : '值'" prop="config_value">
          <el-input v-if="info.config_type === 'input'" v-model="info.config_value" placeholder="请输入值">
            <template v-if="info.config_extra" slot="append">{{ info.config_extra }}</template>
          </el-input>
          <el-input
            v-else-if="info.config_type === 'text'"
            v-model="info.config_value"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="请输入值"
          />
          <el-checkbox-group v-else-if="info.config_type === 'checkbox'" v-model="info.config_value">
            <el-checkbox v-for="(item, index) in options" :key="index" :label="item" />
          </el-checkbox-group>
          <tinymce v-else-if="info.config_type === 'rich'" v-model="info.content" :height="200" />
          <my-upload v-else-if="info.config_type === 'img'" :file-list="img" @change="handleImgChange" />
        </el-form-item>
        <el-form-item v-if="dialogType !== 'setValue'" label="扩展信息" prop="config_extra">
          <el-input v-model="info.config_extra" placeholder="请输入扩展信息，如单位、可选项等。多个选项用半角逗号分隔" />
        </el-form-item>
        <el-form-item v-if="dialogType !== 'setValue'" label="所属分组" prop="config_group">
          <el-select v-model="info.config_group" placeholder="请选择分组" clearable>
            <el-option
              v-for="(item, index) in group"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
import { del, getList, add, edit, setValue } from '@/api/pool/config'
import { arrayReplace, arraySplice, getImgFullPath } from '@/utils'
import Tinymce from '@/components/Tinymce'
import MyUpload from '@/components/MyUpload'

export default {
  name: 'PoolConfig',
  components: { Tinymce, MyUpload },
  mixins: [
    table
  ],
  data() {
    return {
      dialogVisible: false,
      dialogType: '',
      group: [
        { value: 'base', label: '基础' },
        { value: 'user', label: '用户' },
        { value: 'order', label: '订单' },
        { value: 'pay', label: '支付' },
        { value: 'other', label: '其它' }
      ],
      type: [
        { value: 'input', label: '输入框' },
        { value: 'text', label: '文本框' },
        { value: 'radio', label: '单选框' },
        { value: 'checkbox', label: '多选框' },
        { value: 'img', label: '图像' },
        { value: 'rich', label: '富文本' }
      ],
      list: [],
      info: {
        config_name: '',
        config_key: '',
        config_value: [],
        config_type: '',
        config_group: '',
        config_extra: '',
        config_desc: ''
      },
      img: [],
      rules: {
        config_name: [{ required: true, message: '请输入名称', trigger: 'change' }],
        config_key: [{ required: true, message: '请输入Key', trigger: 'change' }],
        config_value: [{ required: true, message: '请输入或选择值', trigger: 'change' }],
        config_group: [{ required: true, message: '请选择分组', trigger: 'change' }],
        config_type: [{ required: true, message: '请选择值类型', trigger: 'change' }]
      },
      currentTag: ''
    }
  },
  computed: {
    dialogTitle() {
      switch (this.dialogType) {
        case 'update':
          return '编辑'
        case 'setValue':
          return '设置值'
        default:
          return '新建'
      }
    },
    options() {
      return this.info.config_extra.split(',').filter(item => {
        return item && item.trim()
      })
    }
  },
  watch: {
    'info.config_type'(val) {
      switch (val) {
        case 'checkbox':
          this.info.config_value = typeof this.info.config_value === 'object' ? this.info.config_value : []
          break
        case 'radio':
          this.info.config_value = this.options.indexOf(this.info.config_value) >= 0 ? this.info.config_value : ''
          break
        default:
          this.info.config_value = typeof this.info.config_value === 'object' ? '' : this.info.config_value
          break
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
      getList().then(res => {
        this.list = res.data
        this.tableLoading = false
      })
    },
    groupList(type) {
      return this.list.filter(item => {
        return item.config_group === type
      }) || []
    },
    formatValue(item) {
      return item.config_type === 'checkbox' ? item.config_value.join('、') : item.config_value
    },
    getImgFullPath(path) {
      return getImgFullPath(path)
    },
    handleTabChange(e) {
      this.currentTag = this.group[e.index].value
    },
    // 重置表单信息
    resetInfo() {
      this.info = {
        config_name: '',
        config_key: '',
        config_value: '',
        config_type: this.type[0].value,
        config_group: this.currentTag,
        config_extra: '',
        config_desc: ''
      }
      this.img = []
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
      if (this.info.config_type === 'img') {
        this.img = this.info.config_value ? [
          { url: getImgFullPath(this.info.config_value) }
        ] : []
        console.log(this.img)
      }
      this.dialogType = type
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
              this.info.config_id = res.data.config_id
              this.list.unshift(Object.assign({}, this.info))
              this.$message.success('添加成功')
              this.dialogVisible = false
            })
          } else if (this.dialogType === 'update') {
            edit(this.info).then(res => {
              this.list = arrayReplace(this.list, 'config_id', this.info)
              this.$message.success('编辑成功')
              this.dialogVisible = false
            })
          } else if (this.dialogType === 'setValue') {
            setValue(this.info).then(res => {
              this.list = arrayReplace(this.list, 'config_id', this.info)
              this.$message.success('设置成功')
              this.dialogVisible = false
            })
          }
        }
      })
    },
    hideDialog(row) {
      row.dialogVisible = false
    },
    handleDelete(row) {
      del(row.config_key).then(res => {
        this.$message.success('删除成功')
        this.hideDialog(row)
        this.$nextTick(() => {
          this.list = arraySplice(this.list, 'config_id', this.info)
        })
      })
    },
    handleImgChange(e) {
      const img = Object.values(e)[0]
      if (img) {
        this.info.config_value = img.path
      } else {
        this.info.cover = ''
      }
    }
  }
}
</script>

<style scoped>
    .demo-form-inline .el-form-item {
      margin-bottom: 0;
    }
</style>
