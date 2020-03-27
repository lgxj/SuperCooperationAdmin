<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="search.keyword" placeholder="关键字搜索" style="width: 200px;" class="filter-item" clearable />
      <el-select v-model="search.status" placeholder="状态" clearable style="width: 100px" class="filter-item">
        <el-option v-for="(item, index) in userStatus" :key="index" :label="item" :value="index" />
      </el-select>
      <el-select v-model="search.is_certification" placeholder="是否实名认证" clearable style="width: 140px" class="filter-item">
        <el-option v-for="(item, index) in globalYesNo" :key="index" :label="item" :value="index" />
      </el-select>
      <el-select v-model="search.type" placeholder="注册类型" clearable style="width: 120px" class="filter-item">
        <el-option v-for="(item, index) in userRegType" :key="index" :label="item" :value="index" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
    </div>

    <el-table v-loading="tableLoading" :data="list" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="用户名" min-width="150">
        <template slot-scope="{row}">
          {{ row.user_name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" min-width="120">
        <template slot-scope="{row}">
          {{ userStatus[row.user_status] }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否实名认证" min-width="150">
        <template slot-scope="{row}">
          {{ globalYesNo[row.is_certification] }}
          <el-link v-if="row.is_certification" type="primary" :underline="false" class="ml-10" @click="showCertification(row)">查看</el-link>
        </template>
      </el-table-column>
      <el-table-column align="center" label="注册类型" min-width="120">
        <template slot-scope="{row}">
          {{ userRegType[row.register_type] }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="注册时间" min-width="160">
        <template slot-scope="{row}">
          {{ row.created_at }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="{row, $index}">
          <el-button type="info" size="mini" plain @click="toIm(row)">发信息</el-button>
          <el-button type="primary" size="mini" plain @click="toOrder(row, 1)">Ta的发单</el-button>
          <el-button v-if="row.is_certification" type="success" size="mini" plain @click="toOrder(row, 2)">Ta的接单</el-button>
          <el-popover
            v-if="Number(row.user_status) === 1"
            v-model="row.dialogVisible"
            placement="top"
            width="180"
            class="ml-10"
          >
            <p>您确定要冻结此用户吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="hideDialog(row)">取消</el-button>
              <el-button type="primary" size="mini" @click="handleFrozen(row, $index)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" size="mini" plain>冻结</el-button>
          </el-popover>
          <el-popover
            v-else
            v-model="row.dialogVisible"
            placement="top"
            width="180"
            class="ml-10"
          >
            <p>您确定要解冻此用户吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="hideDialog(row)">取消</el-button>
              <el-button type="primary" size="mini" @click="handleUnFrozen(row, $index)">确定</el-button>
            </div>
            <el-button slot="reference" type="success" size="mini" plain>解冻</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="pagination" />

    <el-dialog :visible.sync="certificationDialogVisible" title="实名认证信息" :close-on-click-modal="false" min-width="600px">
      <certification v-if="certificationUserId" :user-id="certificationUserId" />
    </el-dialog>
  </div>
</template>

<script>
import table from '@/mixins/table'
import { getList, frozen, unFrozen } from '@/api/user/user'
import { userStatus, userRegType, globalYesNo } from '@/utils/const'

import Certification from './components/Certification'

export default {
  name: 'UserList',
  components: { Certification },
  mixins: [
    table
  ],
  data() {
    return {
      list: [],
      userTypes: [],
      category: [],
      userStatus,
      userRegType,
      globalYesNo,
      certificationDialogVisible: false,
      certificationUserId: ''
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
    // 冻结用户
    handleFrozen(row, index) {
      frozen(row.user_id).then(res => {
        this.$message.success('冻结成功')
        this.hideDialog(row)
        this.$nextTick(() => {
          row.user_status = 0
        })
      })
    },
    // 解冻用户
    handleUnFrozen(row, index) {
      unFrozen(row.user_id).then(res => {
        this.$message.success('解冻成功')
        this.hideDialog(row)
        this.$nextTick(() => {
          row.user_status = 1
        })
      })
    },
    // 显示认证信息
    showCertification(row) {
      this.certificationDialogVisible = true
      this.certificationUserId = row.user_id
    },
    // 去发信息
    toIm(row) {
      this.$router.push({ name: 'MessageIM', query: { userID: 'user-' + row.user_id }})
    },
    // 去订单列表
    toOrder(row, type) {
      this.$message.error('开发中...')
    }
  }
}
</script>

<style scoped>

</style>
