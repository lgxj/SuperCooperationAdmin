<template>
  <div class="app-container">
    <el-table :data="list" border style="width: 100%">
      <el-table-column prop="fee_rule_id" label="规则ID" width="100"></el-table-column>
      <el-table-column prop="fee_type" label="收费类型" width="180"></el-table-column>
      <el-table-column prop="name" label="规则名称"></el-table-column>
      <el-table-column prop="ratio" label="扣费比例（万分比）"></el-table-column>
      <el-table-column prop="display_state" label="状态"></el-table-column>
      <el-table-column prop="channel" label="支付渠道"></el-table-column>
      <el-table-column prop="biz_source" label="业务类型"></el-table-column>
      <el-table-column prop="created_at" label="创建时间"></el-table-column>
      <el-table-column align="center" label="操作" min-width="50">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleEdit(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹出 -->
    <el-dialog :visible.sync="dialogVisible" title="编辑" :close-on-click-modal="false" width="450px">
      <el-form ref="dataForm" :model="info" :rules="rules" label-width="80px" label-position="right">
        <el-form-item label="扣费比例" prop="ratio">
          <el-input v-model="info.ratio" auto-complete="off" placeholder="请输入扣费比例（万分比）" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-switch v-model="info.state"></el-switch>
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
import { getList, edit } from '@/api/account/fee'

export default {
  name: 'AccountCharge',
  mixins: [
    table
  ],
  data() {
    return {
      listQuery: {
        limit: 30
      },
      list: [],
      info: {},
      switch: false,
      search: [],
      dialogVisible: false,
      dialogType: '',
      rules: {
        ratio: [
          { required: true, message: '请输入扣费比例（万分比）', trigger: 'blur' }
        ]
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
    handleEdit(row) {
      if (row.state === 1) {
        row.state = true
      } else {
        row.state = false
      }

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
          edit(this.info).then(res => {
            if (this.info.state) {
              this.info.state = 1
              this.info.display_state = '启用'
            } else {
              this.info.state = 0
              this.info.display_state = '禁用'
            }
            this.list = arrayReplace(this.list, 'fee_rule_id', this.info)
            this.$message.success('编辑成功')
            this.dialogVisible = false
          })
        }
      })
    }
  }
}

</script>

<style scoped>

</style>
