<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="search.keyword" placeholder="搜索版本名/版本号" style="width: 200px;" class="filter-item" clearable />
      <el-select v-model="search.app_type" placeholder="搜索平台" clearable style="width: 120px" class="filter-item">
        <el-option v-for="(item, index) in $const.appTypes" :key="index" :label="item" :value="index" />
      </el-select>
      <el-select v-model="search.is_hot" placeholder="更新类型" clearable style="width: 120px" class="filter-item">
        <el-option v-for="(item, index) in $const.appUpdateTypes" :key="index" :label="item" :value="index" />
      </el-select>
      <el-select v-model="search.is_force" placeholder="是否强制更新" clearable style="width: 120px" class="filter-item">
        <el-option v-for="(item, index) in $const.globalYesNo" :key="index" :label="item" :value="index" />
      </el-select>
      <el-select v-model="search.is_gray" placeholder="是否灰度测试" clearable style="width: 120px" class="filter-item">
        <el-option v-for="(item, index) in $const.globalYesNo" :key="index" :label="item" :value="index" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd">添加</el-button>
    </div>

    <el-table v-loading="tableLoading" :data="list" class="mt-30 w100" border>
      <el-table-column align="center" label="平台" min-width="120">
        <template slot-scope="{row}">
          {{ $const.appTypes[row.app_type] }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="版本名" min-width="120">
        <template slot-scope="{row}">
          {{ row.version_name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="版本号" min-width="100">
        <template slot-scope="{row}">
          {{ row.version }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="升级类型" min-width="100">
        <template slot-scope="{row}">
          {{ $const.appUpdateTypes[row.is_hot] }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否强制更新" min-width="100">
        <template slot-scope="{row}">
          {{ $const.globalYesNo[row.is_force] }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否显示提示" min-width="100">
        <template slot-scope="{row}">
          {{ $const.globalYesNo[row.is_tip] }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否灰度测试" min-width="100">
        <template slot-scope="{row}">
          {{ $const.globalYesNo[row.is_gray] }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="180">
        <template slot-scope="{row, $index}">
          <el-button type="info" size="mini" plain @click="handleEdit(row)">编辑</el-button>
          <el-popover
            v-model="row.dialogVisible"
            placement="top"
            width="180"
            class="ml-10"
          >
            <p>您确定要删除此记录吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="hideDialog(row)">取消</el-button>
              <el-button type="primary" size="mini" @click="handleDel(row, $index)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" size="mini" plain>删除</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" :close-on-click-modal="false">
      <el-form ref="dataForm" :model="info" :rules="rules" label-width="120px" label-position="left">
        <el-form-item label="平台" prop="app_type">
          <el-select v-model="info.app_type" placeholder="请选择平台" clearable>
            <el-option v-for="(item, index) in $const.appTypes" :key="index" :label="item" :value="index" />
          </el-select>
        </el-form-item>
        <el-form-item label="版本名" prop="version_name">
          <el-input v-model="info.version_name" placeholder="请输入版本名" />
        </el-form-item>
        <el-form-item label="版本号" prop="version">
          <el-input v-model.number="info.version" type="number" placeholder="请输入版本号" />
        </el-form-item>
        <el-form-item label="上传更新包">
          <my-upload list-type="text" :show-file-list="false" :business-type="1" @change="handleChange">
            <el-button size="small" type="primary">点击上传</el-button>
          </my-upload>
          <div class="el-upload__tip">资源包上传wgt文件，安卓安装包上传apk文件，苹果安装包上传ipa文件。</div>
          <div class="el-upload__tip">也可直接在下方输入框填写下载地址</div>
        </el-form-item>
        <el-form-item label="下载地址" prop="download_url">
          <el-input v-model="info.download_url" placeholder="请输入下载地址" />
        </el-form-item>
        <el-form-item label="升级类型" prop="is_hot">
          <el-radio-group v-model="info.is_hot">
            <el-radio v-for="(val, key) in $const.appUpdateTypes" :key="key" :label="key">{{ val }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否强制更新" prop="is_force">
          <el-switch v-model.number="info.is_force" :active-value="1" :inactive-value="0" active-color="#13ce66" inactive-color="#909399"></el-switch>
        </el-form-item>
        <el-form-item label="是否显示提示" prop="is_tip">
          <el-switch v-model.number="info.is_tip" :disabled="!!info.is_force" :active-value="1" :inactive-value="0" active-color="#13ce66" inactive-color="#909399"></el-switch>
        </el-form-item>
        <el-form-item label="是否灰度测试" prop="is_gray">
          <el-switch v-model.number="info.is_gray" :active-value="1" :inactive-value="0" active-color="#13ce66" inactive-color="#909399"></el-switch>
        </el-form-item>
        <el-form-item label="更新内容" prop="description">
          <el-input v-model="info.description" type="textarea" :autosize="{ minRows: 2}" placeholder="请输入内容"></el-input>
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
import { getList, edit, add, del } from '@/api/pool/upgrade'
import { arrayReplace } from '@/utils'
import MyUpload from '@/components/MyUpload/index.vue'

export default {
  name: 'PoolAppUpdate',
  components: { MyUpload },
  mixins: [
    table
  ],
  data() {
    return {
      list: [],
      dialogVisible: false,
      dialogType: '',
      dialogTitle: '',
      info: {
        app_type: '',
        version_name: '',
        version: '',
        download_url: '',
        is_hot: '1',
        is_force: 1,
        is_tip: 1,
        is_gray: 0,
        description: ''
      },
      rules: {
        app_type: [{ required: true, message: '请选择平台', trigger: 'change' }],
        version_name: [{ required: true, message: '请输入版本名', trigger: 'change' }],
        version: [{ required: true, message: '请输入版本号', trigger: 'change' }, { type: 'number', message: '版本号必须是整数', trigger: 'change' }],
        download_url: [{ required: true, message: '请输入下载地址', trigger: 'change' }]
      }
    }
  },
  watch: {
    'info.is_force'(val) {
      if (val) this.info.is_tip = 1
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
    hideDialog(row) {
      row.dialogVisible = false
    },
    // 重置表单信息
    resetInfo() {
      this.info = {
        app_type: '',
        version_name: '',
        version: '',
        download_url: '',
        is_hot: '1',
        is_force: 1,
        is_tip: 1,
        is_gray: 0,
        description: ''
      }
    },
    handleAdd() {
      this.resetInfo()
      this.dialogType = 'add'
      this.dialogTitle = '添加'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleEdit(row) {
      this.info = Object.assign({}, row) // copy obj
      this.info.is_hot = String(this.info.is_hot)
      this.dialogType = 'update'
      this.dialogTitle = '编辑'
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
              this.info.app_id = res.data.app_id
              this.list.unshift(Object.assign({}, this.info))
              this.$message.success('添加成功')
              this.dialogVisible = false
            })
          } else if (this.dialogType === 'update') {
            edit(this.info).then(res => {
              this.list = arrayReplace(this.list, 'app_id', this.info)
              this.$message.success('编辑成功')
              this.dialogVisible = false
            })
          }
        }
      })
    },
    handleDel(row, index) {
      del(row.user_id).then(_ => {
        this.$message.success('删除成功')
        this.hideDialog(row)
        this.$nextTick(() => {
          this.list.splice(index, 1)
        })
      })
    },
    handleChange(e) {
      for (const i in e) {
        e[i].hasSuccess && (this.info.download_url = e[i].url)
      }
    }
  }
}
</script>

<style scoped>
  .el-upload__tip {
    line-height: 1.5;
  }
</style>
