<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="search.keyword" placeholder="关键字搜索" style="width: 200px;" class="filter-item" clearable />
      <el-select v-model="search.role_id" placeholder="角色" clearable style="width: 90px" class="filter-item">
        <el-option v-for="(item, index) in roles" :key="index" :label="item.name" :value="item.role_id" />
      </el-select>
      <el-select v-model="search.status" placeholder="状态" clearable class="filter-item" style="width: 130px">
        <el-option v-for="(item, index) in status" :key="index" :label="item" :value="index" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleAdd">添加</el-button>
    </div>

    <el-table v-loading="tableLoading" :data="list" style="width: 100%;margin-top:30px;" border stripe>
      <el-table-column align="center" label="用户名" min-width="150">
        <template slot-scope="{row}">
          {{ row.username }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名" min-width="100">
        <template slot-scope="{row}">
          {{ row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="头像" min-width="100">
        <template slot-scope="{row}">
          <el-image lazy :src="row.avatar" style="width: 70px; height: 70px" fit="cover" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色" min-width="120">
        <template slot-scope="{row}">
          {{ getRoleNames(row.roleIds) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" min-width="120">
        <template slot-scope="{row}">
          {{ getStatusName(row.status) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="最后登录" min-width="200">
        <template slot-scope="{row}">
          <div v-if="row.last_login_at">
            时间：{{ row.last_login_at }}<br>
            IP：{{ row.last_login_ip }}
          </div>
          <div v-else>-</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="260">
        <template slot-scope="{row}">
          <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="warning" size="small" @click="handleResetPwd(row)">重置密码</el-button>
          <el-button v-if="row.status" type="danger" size="small" @click="handleFrozen(row)">冻结</el-button>
          <el-button v-else type="warning" size="small" @click="handleUnFrozen(row)">解冻</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="pagination" />

    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" :close-on-click-modal="false">
      <el-form ref="dataForm" :rules="rules" :model="info" label-width="80px" label-position="left">
        <el-form-item v-if="dialogType !== 'reset_pwd'" label="用户名" prop="username">
          <el-input v-model="info.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item v-if="dialogType === 'reset_pwd' || dialogType === 'create'" label="密码" prop="password">
          <el-input v-model="info.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item v-if="dialogType === 'reset_pwd' || dialogType === 'create'" label="确认密码" prop="repeat_password">
          <el-input v-model="info.repeat_password" type="password" placeholder="请确认密码" />
        </el-form-item>
        <el-form-item v-if="dialogType !== 'reset_pwd'" label="姓名" prop="name">
          <el-input v-model="info.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item v-if="dialogType !== 'reset_pwd'" label="角色" prop="roleIds">
          <el-select v-model="info.roleIds" multiple placeholder="请选择角色" style="width: 100%">
            <el-option
              v-for="item in roles"
              :key="item.role_id"
              :label="item.name"
              :value="item.role_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="dialogType !== 'reset_pwd'" label="头像" prop="name">
          <el-image lazy :src="info.avatar" style="width: 70px; height: 70px" fit="cover" />
          <el-button type="primary" icon="el-icon-upload" style="position: absolute;bottom: 15px;margin-left: 40px;" @click="imageCropperShow=true">
            选择图片
          </el-button>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
      </div>
    </el-dialog>

    <image-cropper
      v-show="imageCropperShow"
      :key="imageCropperKey"
      :width="300"
      :height="300"
      field="image"
      @close="imageCropperShow = false"
      @crop-upload-success="cropperSuccess"
    />
  </div>
</template>

<script>
import table from '@/mixins/table'
import { validateName, validatePwd, validateUsername } from '@/utils/validate'
import { getList, add, edit, resetPwd } from '@/api/admin'
import ImageCropper from '@/components/ImageCropper'
import { arrayReplace } from '@/utils'

export default {
  name: 'Admin',
  components: { ImageCropper },
  mixins: [
    table
  ],
  data() {
    const validateRepeatPwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.info.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      status: ['冻结', '正常'],
      list: [],
      info: {
        username: '',
        password: '',
        repeat_password: '',
        name: '',
        status: 1,
        avatar: '',
        roleIds: []
      },
      roles: [{
        role_id: 1,
        name: '总管理员'
      }, {
        role_id: 2,
        name: '账务'
      }, {
        role_id: 3,
        name: '运营'
      }],
      dialogVisible: false,
      dialogType: '',
      rules: {
        username: [{ required: true, validator: validateUsername, trigger: 'change' }],
        password: [{ required: true, validator: validatePwd, trigger: 'change' }],
        repeat_password: [{ required: true, validator: validateRepeatPwd, trigger: 'change' }],
        name: [{ required: true, validator: validateName, trigger: 'change' }],
        roleIds: [{ required: true, message: '请选择角色', trigger: 'change' }]
      },
      imageCropperKey: 0,
      imageCropperShow: false
    }
  },
  computed: {
    dialogTitle() {
      switch (this.dialogType) {
        case 'update':
          return '编辑管理员'
        case 'reset_pwd':
          return '重置密码'
        default:
          return '添加管理员'
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
    getRoleNames(ids) {
      const names = []
      this.roles.map(item => {
        if (ids.indexOf(item.role_id) >= 0) {
          names.push(item.name)
        }
      })
      return names.join('、') || '-'
    },
    getStatusName(status) {
      return this.status[status]
    },
    handleAdd() {
      this.resetInfo()
      this.dialogType = 'create'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 重置表单信息
    resetInfo() {
      this.info = {
        username: '',
        password: '',
        repeat_password: '',
        name: '',
        avatar: '',
        status: 1,
        roleIds: []
      }
    },
    handleEdit(row) {
      this.currentRow = row
      this.info = Object.assign({}, row) // copy obj
      this.dialogType = 'update'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleResetPwd(row) {
      this.info = Object.assign({}, row) // copy obj
      this.dialogType = 'reset_pwd'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleFrozen() {

    },
    handleUnFrozen() {

    },
    handleSave() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dialogType === 'create') {
            add(this.info).then(res => {
              this.info.admin_id = res.data.admin_id
              this.list.unshift(this.info)
              this.$message.success('添加成功')
              this.dialogVisible = false
            })
          } else if (this.dialogType === 'update') {
            edit(this.info).then(res => {
              this.list = arrayReplace(this.list, 'admin_id', this.info)
              this.$message.success('编辑成功')
              this.dialogVisible = false
            })
          } else if (this.dialogType === 'reset_pwd') {
            resetPwd(this.info).then(res => {
              this.$message.success('重置密码成功')
              this.dialogVisible = false
            })
          }
        }
      })
    },
    cropperSuccess(resData) {
      this.imageCropperShow = false
      // this.imageCropperKey = this.imagecropperKey + 1
      this.info.avatar = resData.path
    }
  }
}
</script>

<style scoped>

</style>
