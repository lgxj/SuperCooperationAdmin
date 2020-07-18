<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="search.role_id" placeholder="角色" clearable style="width: 150px" class="filter-item">
        <el-option v-for="(value, key) in roles" :key="key" :label="value" :value="key" />
      </el-select>
      <el-button class="filter-item ml-10" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd">添加</el-button>
    </div>

    <el-table v-loading="tableLoading" :data="list" style="width: 100%;margin-top:30px;" stripe>
      <el-table-column align="left" label="ID" min-width="60">
        <template slot-scope="{row}">
          {{ row.user_id }}
        </template>
      </el-table-column>
      <el-table-column align="left" label="手机号" min-width="150">
        <template slot-scope="{row}">
          {{ row.phone }}
        </template>
      </el-table-column>
      <el-table-column align="left" label="姓名" min-width="100">
        <template slot-scope="{row}">
          {{ row.user_name }}
        </template>
      </el-table-column>
      <el-table-column align="left" label="头像" min-width="100">
        <template slot-scope="{row}">
          <el-image v-if="row.user_avatar" lazy :src="row.user_avatar | concatImgUrl('userListAvatar')" fit="cover" />
          <span v-else class="form-desc-text">未设置</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="角色" min-width="120">
        <template slot-scope="{row}">
          <div v-for="(val, key) in getRoleNames(row)" :key="key">{{ val }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="最后登录" min-width="200">
        <template slot-scope="{row}">
          <div v-if="row.last_login_at">
            IP：{{ row.last_login_ip }}<br>
            时间：{{ row.last_login_at }}
          </div>
          <div v-else>-</div>
        </template>
      </el-table-column>
      <el-table-column align="right" label="操作" min-width="420">
        <template slot-scope="{row}">
          <el-button type="primary" plain size="mini" @click="handleEdit(row)">编辑</el-button>
          <el-button type="warning" plain size="mini" @click="handleResetPwd(row)">重置密码</el-button>
          <el-button v-if="!row.is_self" type="success" plain size="mini" @click="handleSendMessage(row)">发消息</el-button>
          <el-button type="info" plain size="mini" class="ml-10" @click="handleShowLog(row)">操作日志</el-button>
          <el-popover
            v-if="!row.is_super && !row.is_self"
            v-model="row.dialogVisible"
            placement="top"
            width="180"
          >
            <p>您确定要删除此员工吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="hideDialog(row)">取消</el-button>
              <el-button type="primary" size="mini" @click="handleDelete(row, $index)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" plain size="mini" class="ml-10">删除</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="pagination" />

    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" :close-on-click-modal="false">
      <el-form ref="dataForm" :rules="rules" :model="info" label-width="80px" label-position="left">
        <el-form-item v-if="dialogType === 'reset_pwd'" label="密码" prop="password">
          <el-input v-model="info.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item v-if="dialogType === 'reset_pwd'" label="确认密码" prop="repeat_password">
          <el-input v-model="info.repeat_password" type="password" placeholder="请确认密码" />
        </el-form-item>
        <el-form-item v-if="dialogType === 'update'" label="姓名" prop="user_name">
          <el-input v-model="info.user_name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item v-if="dialogType === 'update'" label="角色" prop="roleIds">
          <el-select v-model="info.roleIds" multiple placeholder="请选择角色" :disabled="info.is_super" style="width: 100%">
            <el-option
              v-for="(item, index) in roles"
              :key="index"
              :label="item"
              :value="Number(index)"
              :disabled="Number(index) === 0"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="dialogType === 'update'" label="头像" prop="user_avatar">
          <el-image v-if="info.avatar" lazy :src="info.avatar" style="width: 70px; height: 70px" fit="cover" />
          <el-button type="primary" icon="el-icon-upload" @click="imageCropperShow=true">
            选择图片
          </el-button>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="addDialogVisible" title="添加管理员" :close-on-click-modal="false">
      <el-form ref="dataForm" :rules="rules" :model="info" label-width="80px" label-position="left">
        <div v-if="addStep === 1">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="info.phone" placeholder="请输入手机号">
              <el-button slot="append" icon="el-icon-search" @click="handleFind" />
            </el-input>
          </el-form-item>
          <el-form-item label="" style="height: 50px">
            <el-checkbox v-if="info.user_id" v-model="info.checked" :label="info.user_name + '(' + info.username + ')'" border />
            <span v-if="info.new">没有找到此帐号</span>
          </el-form-item>
        </div>
        <div v-if="addStep === 2">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="info.phone" disabled></el-input>
          </el-form-item>
          <el-form-item v-if="info.new" label="密码" prop="password">
            <el-input v-model="info.password" type="password" placeholder="请输入密码" />
          </el-form-item>
          <el-form-item v-if="info.new" label="确认密码" prop="repeat_password">
            <el-input v-model="info.repeat_password" type="password" placeholder="请确认密码" />
          </el-form-item>
          <el-form-item label="姓名" prop="user_name">
            <el-input v-model="info.user_name" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="角色" prop="roleIds">
            <el-select v-model="info.roleIds" multiple placeholder="请选择角色" :disabled="info.is_super" style="width: 100%">
              <el-option
                v-for="(item, index) in roles"
                :key="index"
                :label="item"
                :value="Number(index)"
                :disabled="Number(index) === 0"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="头像" prop="user_avatar">
            <image-pre-and-up :value="info.user_avatar" :cut="true" :width="160" :height="160" :pre-width="60" :pre-height="60" @change="handleAvatarChange"></image-pre-and-up>
            <p class="form-desc-text">建议尺寸60*60像素</p>
          </el-form-item>
        </div>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" plain @click="addDialogVisible=false">取消</el-button>
        <el-button v-if="info.user_id && addStep === 1" type="primary" :disabled="!info.checked" @click="addStep = 2">下一步</el-button>
        <el-button v-if="info.new && addStep === 1" type="primary" @click="addStep = 2">创建帐号</el-button>
        <el-button v-if="addStep === 2" type="default" @click="addStep = 1">上一步</el-button>
        <el-button v-if="addStep === 2" type="primary" @click="handleSave">确定</el-button>
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
import { validateName, validatePwd, validateMobile } from '@/utils/validate'
import { getList, add, edit, resetPwd, del, searchByPhone } from '@/api/admin'
import { getDic as getRoleDic } from '@/api/permission/role'
import { arrayReplace } from '@/utils'
import ImageCropper from '@/components/ImageCropper'

export default {
  name: 'PermissionAdmin',
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
      info: {},
      roles: {},
      dialogVisible: false,
      dialogType: '',
      addDialogVisible: false,
      addStep: 1,
      rules: {
        phone: [{ required: true, validator: validateMobile, trigger: 'blur' }],
        password: [{ required: true, validator: validatePwd, trigger: 'blur' }],
        repeat_password: [{ required: true, validator: validateRepeatPwd, trigger: 'blur' }],
        user_name: [{ required: true, validator: validateName, trigger: 'blur' }],
        roleIds: [{ required: true, message: '请选择角色', trigger: 'blur' }]
      },
      imageCropperKey: 0,
      imageCropperShow: false,
      frozenVisible: [],
      visible: false
    }
  },
  computed: {
    dialogTitle() {
      switch (this.dialogType) {
        case 'update':
          return '编辑管理员'
        case 'reset_pwd':
          return '重置密码'
        case 'bind-user':
          return '绑定前台用户'
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
      this.loadRole()
      this.loadData()
    },
    loadRole() {
      getRoleDic(this.$settings.SYSTEM_MANAGE).then(res => {
        this.roles = res.data
      })
    },
    loadData() {
      getList(this.listQuery.page, this.listQuery.limit, this.search).then(res => {
        this.loadedData(res)
      })
    },
    getRoleNames(item) {
      const names = []
      item.roleIds.map(id => {
        names.push(this.roles[id])
      })
      return names
    },
    handleAdd() {
      this.resetInfo()
      this.addStep = 1
      this.dialogType = 'create'
      this.addDialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleFind() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          searchByPhone(this.info.phone).then(res => {
            if (this.$filters.isEmpty(res.data)) {
              this.info.user_id = ''
              this.info.user_name = ''
              this.info.user_avatar = ''
              this.info.roleIds = []
              this.info.new = true
            } else {
              this.info = Object.assign(this.info, res.data)
              this.info.new = false
              this.info.roleIds = []
              this.info.checked = true
            }
          })
        }
      })
    },
    // 重置表单信息
    resetInfo() {
      this.info = {
        user_id: '',
        phone: '',
        password: '',
        repeat_password: '',
        user_name: '',
        user_avatar: '',
        status: 1,
        roleIds: [],
        new: false,
        checked: false
      }
    },
    handleEdit(row) {
      this.info = Object.assign({}, row)
      this.dialogType = 'update'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleResetPwd(row) {
      this.info = Object.assign({}, row, {
        password: '',
        repeat_password: ''
      })
      this.dialogType = 'reset_pwd'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row, index) {
      del(row.user_id).then(res => {
        this.$message.success('删除成功')
        this.list.splice(index, 1)
      })
    },
    handleSave() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dialogType === 'create') {
            add(this.info).then(res => {
              this.info.user_id = res.data.user_id
              this.list.unshift(Object.assign({}, this.info))
              this.$message.success('添加成功')
              this.addDialogVisible = false
            })
          } else if (this.dialogType === 'update') {
            edit(this.info).then(res => {
              this.list = arrayReplace(this.list, 'user_id', this.info)
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
      this.info.avatar = resData.image
    },
    handleShowLog(row) {
      this.$router.push({ name: 'PermissionAdminLog', params: { id: row.user_id, name: this.$filters.trim(row.user_name) }})
    },
    handleSendMessage(row) {
      this.$router.push({ name: 'MessageIM', query: { userID: 'user-' + row.user_id }})
    },
    handleAvatarChange(data) {
      this.info.user_avatar = data.length ? (data[0].org_url || data[0].url) : ''
    }
  }
}
</script>

<style scoped>

</style>
