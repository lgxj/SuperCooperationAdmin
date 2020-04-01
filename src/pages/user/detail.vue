<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>基本信息</span>
          </div>
          <div class="list">
            <div class="item">
              <div class="label">ID</div>
              <div class="content">{{ info.user_id }}</div>
            </div>
            <div class="item">
              <div class="label">昵称</div>
              <div class="content">{{ info.user_name }}</div>
            </div>
            <div class="item">
              <div class="label">头像</div>
              <div class="content"><el-image lazy :src="info.user_avatar" style="width: 70px; height: 70px" fit="cover" /></div>
            </div>
            <div class="item">
              <div class="label">注册方式</div>
              <div class="content">{{ $const.userRegType[info.register_type] }}</div>
            </div>
            <div class="item">
              <div class="label">注册时间</div>
              <div class="content">{{ info.created_at }}</div>
            </div>
            <div class="item">
              <div class="label">注册IP</div>
              <div class="content">{{ info.register_ip }}</div>
            </div>
            <div class="item">
              <div class="label">雇主星级</div>
              <div class="content">{{ info.employer_level }}</div>
            </div>
          </div>
        </el-card>

        <el-card class="box-card mt-10">
          <div slot="header" class="clearfix">
            <span>帮手信息</span>
          </div>
          <div v-if="info.is_certification" class="list">
            <div class="item">
              <div class="label">认证时间</div>
              <div class="content">{{ info.helper_cert_at }}</div>
            </div>
            <div class="item">
              <div class="label">帮手星级</div>
              <div class="content">{{ info.helper_level }}</div>
            </div>
            <div class="item">
              <div class="label">实名信息</div>
              <div class="content"><el-button type="text" class="no-padding" size="mini" @click="toCertification">点击查看</el-button></div>
            </div>
          </div>
          <div v-else class="empty">未认证帮手</div>
        </el-card>
      </el-col>

      <el-col :span="16">
        <el-card class="box-card" :body-style="{padding: 0}">
          <div slot="header" class="clearfix">
            <span>授权/登录信息</span>
          </div>
          <el-table :data="info.grant_login" style="width: 100%;" stripe size="mini">
            <el-table-column align="center" label="登录方式">
              <template slot-scope="{row}">
                {{ $const.userRegType[row.grant_login_type] }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="登录标识">
              <template slot-scope="{row}">
                {{ row.grant_login_identify }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="昵称">
              <template slot-scope="{row}">
                {{ row.grant_user_nickname || '-' }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="头像">
              <template slot-scope="{row}">
                <el-image v-if="row.grant_user_avatar" lazy :src="row.grant_user_avatar" style="width: 36px; height: 36px" fit="cover" />
                <span v-else>-</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <el-card class="box-card mt-10" :body-style="{padding: 0}">
          <div slot="header" class="clearfix">
            <span>常用地址</span>
          </div>
          <el-table :data="info.address_list" style="width: 100%;" stripe size="mini">
            <el-table-column align="center" label="联系人">
              <template slot-scope="{row}">
                {{ row.user_name }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="联系电话">
              <template slot-scope="{row}">
                {{ row.user_phone }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="省">
              <template slot-scope="{row}">
                {{ row.province }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="市">
              <template slot-scope="{row}">
                {{ row.city }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="区">
              <template slot-scope="{row}">
                {{ row.region }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="街道">
              <template slot-scope="{row}">
                {{ row.street }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="详细地址">
              <template slot-scope="{row}">
                {{ row.address_detail }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <el-card class="box-card mt-10" :body-style="{padding: 0}">
          <div slot="header" class="clearfix">
            <span>帮手技能</span>
          </div>
          <el-table :data="info.skill_certify" style="width: 100%;" stripe size="mini">
            <el-table-column align="center" label="技能类型">
              <template slot-scope="{row}">
                {{ row.order_category }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="证书类型">
              <template slot-scope="{row}">
                {{ row.card_type }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="证件号">
              <template slot-scope="{row}">
                {{ row.card_no }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="证件正页">
              <template slot-scope="{row}">
                <el-image v-if="row.original_url" lazy :src="row.original_url" style="width: 72px; height: 72px" fit="cover" :preview-src-list="getSkillCertifyPhoto(row)" />
              </template>
            </el-table-column>
            <el-table-column align="center" label="证件副页">
              <template slot-scope="{row}">
                <el-image v-if="row.copy_url" lazy :src="row.copy_url" style="width: 72px; height: 72px" fit="cover" :preview-src-list="getSkillCertifyPhoto(row)" />
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog :visible.sync="certificationDialogVisible" title="实名认证信息" :close-on-click-modal="false" min-width="600px">
      <certification v-if="certificationDialogVisible" :user-id="user_id" />
    </el-dialog>
  </div>
</template>

<script>
import Certification from './components/Certification'
import { getDetail } from '@/api/user/user'

export default {
  name: 'UserDetail',
  components: { Certification },
  data() {
    return {
      user_id: '',
      certificationDialogVisible: false,
      info: {
        grant_login: [],
        address_list: [],
        skill_certify: [],
        is_certification: 1
      }
    }
  },
  created() {
    this.user_id = this.$route.params.id
    this.init()
  },
  methods: {
    init() {
      getDetail(this.user_id).then(res => {
        this.info = res.data
      })
    },
    toCertification() {
      console.log('sdfasdf')
      this.certificationDialogVisible = true
    },
    getSkillCertifyPhoto(item) {
      const photos = []
      if (item.original_url) {
        photos.push(item.original_url)
      }
      if (item.copy_url) {
        photos.push(item.copy_url)
      }
      return photos
    }
  }
}
</script>

<style scoped>
  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
  }
  .item + .item {
    margin-top: 10px;
    padding-top: 10px;
    border-top: solid 1px #efefef;
  }
  .item .label {
    flex: none;
    width: 80px;
    color: #999999;
  }
  .item .content {
    flex: auto;
    color: #666666;
  }

  .empty {
    padding: 10px 0;
    font-size: 14px;
    color: #999999;
    text-align: center;
  }
</style>
