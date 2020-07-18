<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>任务信息</span>
          </div>
          <div class="list">
            <div class="item">
              <div class="label">单号</div>
              <div class="content">{{ info.order_no }}</div>
            </div>
            <div class="item">
              <div class="label">名称</div>
              <div class="content">{{ info.order_name }}</div>
            </div>
            <div class="item">
              <div class="label">内容</div>
              <div class="content">{{ info.text.voice_text }}</div>
            </div>
            <div class="item">
              <div class="label">语音</div>
              <div class="content">
                <audio :src="info.text.voice_url" controls></audio>
              </div>
            </div>
            <div class="item">
              <div class="label">任务时间</div>
              <div class="content">{{ info.start_time }}- {{ info.end_time }}</div>
            </div>
            <div class="item">
              <div class="label">任务模式</div>
              <div class="content">{{ info.display_order_type }}</div>
            </div>
            <div class="item">
              <div class="label">订单金额</div>
              <div class="content">{{ info.display_origin_price }}元</div>
            </div>
            <div class="item">
              <div class="label">接单星级</div>
              <div class="content">{{ info.helper_level }}星及以上</div>
            </div>
            <div class="item">
              <div class="label">任务状态</div>
              <div class="content">{{ info.display_employer_order_state }}</div>
            </div>
            <div class="item">
              <div class="label">任务备注</div>
              <div class="content">{{ info.memo || '无' }}</div>
            </div>
          </div>
        </el-card>

        <el-card class="box-card mt-10">
          <div slot="header" class="clearfix">
            <span>任务图片/视频</span>
          </div>
          <div class="list">
            <div class="item">
              <div v-if="taskAttachList.length" class="content clearfix">
                <template v-for="(item, index) in taskAttachList">
                  <el-image
                    v-if="item.type === 'image'"
                    :key="index"
                    style="width: 100px; height: 100px; float: left; margin-right: 10px; margin-bottom: 10px"
                    :src="item.url"
                    :preview-src-list="taskAttachImageList"
                  >
                  </el-image>
                  <video v-else :key="index" :src="item.url" controls style="width: 100px; height: 100px; float: left; margin-right: 10px; margin-bottom: 10px"></video>
                </template>
              </div>
              <div v-else class="content">无</div>
            </div>
          </div>
        </el-card>

        <el-card class="box-card mt-10">
          <div slot="header" class="clearfix">
            <span>增值服务</span>
          </div>
          <div class="list">
            <div class="item">
              <div class="label">订单加急</div>
              <div class="content">{{ info.services.urgent_price ? '是(' + info.display_services.urgent_price + '元)' : '否' }}</div>
            </div>
            <div class="item">
              <div class="label">订单保险</div>
              <div class="content">{{ info.services.insurance_price ? '是(' + info.display_services.insurance_price + '元)' : '否' }}</div>
            </div>
            <div class="item">
              <div class="label">扫脸接单</div>
              <div class="content">{{ info.services.face_price ? '是(' + info.display_services.face_price + '元)' : '否' }}</div>
            </div>
          </div>
        </el-card>

        <el-card class="box-card mt-10">
          <div slot="header" class="clearfix">
            <span>任务地址</span>
          </div>
          <div class="list">
            <div v-for="(item, index) in info.address_list" :key="index" class="item">
              <div class="label">{{ info.address_list.length > 1 ? (index ? '终点' : '起点') : '地点：' }}</div>
              <div class="content">{{ item | formatAddress }}</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>发单用户</span>
          </div>
          <div class="list">
            <div class="item">
              <div class="label">昵称</div>
              <div class="content">{{ info.user.user_name }}</div>
            </div>
            <div class="item">
              <div class="label">头像</div>
              <div class="content"><el-image lazy :src="info.user.user_avatar" style="width: 70px; height: 70px" fit="cover" /></div>
            </div>
            <div class="item">
              <div class="label">雇主星级</div>
              <div class="content">{{ info.user.employer_level }}</div>
            </div>
          </div>
        </el-card>

        <el-card v-if="isCompetitionTask" class="box-card mt-10">
          <div slot="header" class="clearfix">
            <span>报价列表</span>
          </div>
          <div v-if="!$filters.isEmpty(info.quoted_list)" class="list">
            <div v-for="(item, index) in info.quoted_list" :key="index" class="item">
              <div class="label">{{ item.quoted_price }}元</div>
              <div class="content">{{ item.user_name }}({{ item.helper_level }}星)</div>
            </div>
          </div>
          <div v-else class="empty">暂无帮手报价</div>
        </el-card>

        <el-card class="box-card mt-10">
          <div slot="header" class="clearfix">
            <span>接单帮手</span>
          </div>
          <div v-if="!$filters.isEmpty(info.helper)" class="list">
            <div class="item">
              <div class="label">昵称</div>
              <div class="content">{{ info.helper.user_name }}</div>
            </div>
            <div class="item">
              <div class="label">头像</div>
              <div class="content"><el-image lazy :src="info.helper.user_avatar" style="width: 70px; height: 70px" fit="cover" /></div>
            </div>
            <div class="item">
              <div class="label">帮手星级</div>
              <div class="content">{{ info.helper.helper_level }}</div>
            </div>
            <div class="item">
              <div class="label">预计收入</div>
              <div class="content">{{ info.display_origin_price }}元 (扣除手续费及抽成前)</div>
            </div>
            <div class="item">
              <div class="label">姓名</div>
              <div class="content">{{ info.helper.real_name }}</div>
            </div>
            <div class="item">
              <div class="label">身份证号</div>
              <div class="content">{{ info.helper.idcard }}</div>
            </div>
            <div v-if="info.helper.face_auth" class="item">
              <div class="label">扫脸照片</div>
              <div class="content"><el-image lazy :src="info.helper.face_auth.photo" style="width: 70px; height: 70px" fit="cover" :preview-src-list="[info.helper.face_auth.photo]" /></div>
            </div>
          </div>
          <div v-else class="empty">{{ noHelper }}</div>
        </el-card>

        <el-card v-if="!$filters.isEmpty(info.defer)" class="box-card mt-10">
          <div slot="header" class="clearfix">
            <span>延迟交付</span>
          </div>
          <div class="list">
            <div class="item">
              <div class="label">延期时长</div>
              <div class="content">{{ info.defer.defer_minutes }}分钟</div>
            </div>
            <div class="item">
              <div class="label">延迟原因</div>
              <div class="content">{{ info.defer.reason }}</div>
            </div>
            <div class="item">
              <div class="label">申请状态</div>
              <div class="content">{{ info.defer.status_str }}</div>
            </div>
            <div class="item">
              <div class="label">申请时间</div>
              <div class="content">{{ info.defer.created_at }}</div>
            </div>
          </div>
        </el-card>

        <el-card class="box-card mt-10" :body-style="{padding: 0}">
          <div slot="header" class="clearfix">
            <span>订单流水</span>
          </div>
          <el-table :data="info.pay_logs" style="width: 100%;" stripe size="mini">
            <el-table-column align="center" label="用户" width="90">
              <template slot-scope="{row}">
                {{ row.user_name }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="类型" width="50">
              <template slot-scope="{row}">
                {{ row.type_str }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="金额">
              <template slot-scope="{row}">
                {{ row.amount }}元
                <div v-if="row.type === 'pay'">
                  支付手续费：{{ row.third_fee }}元
                </div>
                <div v-if="row.type === 'pay'">
                  平台服务费：{{ row.platform_fee }}元
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="渠道">
              <template slot-scope="{row}">
                {{ row.channel }}
                <div v-if="row.channel !== 'balance'">渠道单号：{{ row.channel_refund_no }}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="时间">
              <template slot-scope="{row}">
                {{ row.created_at }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>任务时间线</span>
          </div>
          <el-timeline v-if="info.time_lines">
            <el-timeline-item
              v-for="(activity, index) in info.time_lines"
              :key="index"
              :icon="activity.icon"
              :type="activity.type"
              :color="activity.color"
              :size="activity.size"
              :timestamp="activity.timestamp"
            >
              <div>{{ activity.content }}</div>
              <div v-if="activity.desc" class="time-desc">{{ activity.desc }}</div>
            </el-timeline-item>
          </el-timeline>
        </el-card>

        <el-card class="box-card mt-10">
          <div slot="header" class="clearfix">
            <span>雇主评价</span>
          </div>
          <div v-if="info.helper_comments" class="list">
            <div class="item">
              <div class="label">星级</div>
              <div class="content">
                <el-rate
                  :value="Number(info.helper_comments.score)"
                  disabled
                  show-score
                  text-color="#ff9900"
                />
              </div>
            </div>
            <div class="item">
              <div class="label">标签</div>
              <div class="content">{{ info.helper_comments.extra.label.join('、') }}</div>
            </div>
            <div class="item">
              <div class="label">内容</div>
              <div class="content">{{ info.helper_comments.content }}</div>
            </div>
            <div class="item">
              <div class="label">图片</div>
              <div v-if="info.helper_comments.attach_list.length" class="content clearfix">
                <el-image
                  v-for="(item, index) in info.helper_comments.attach_list"
                  :key="index"
                  style="width: 100px; height: 100px; float: left; margin-right: 10px; margin-bottom: 10px"
                  :src="item"
                  :preview-src-list="info.helper_comments.attach_list"
                >
                </el-image>
              </div>
              <div v-else class="content">无</div>
            </div>
          </div>
          <div v-else class="empty">暂未评价</div>
        </el-card>

        <el-card class="box-card mt-10">
          <div slot="header" class="clearfix">
            <span>帮手评价</span>
          </div>
          <div v-if="info.employer_comments" class="list">
            <div class="item">
              <div class="label">星级</div>
              <div class="content">
                <el-rate
                  :value="Number(info.employer_comments.score)"
                  disabled
                  show-score
                  text-color="#ff9900"
                />
              </div>
            </div>
            <div class="item">
              <div class="label">标签</div>
              <div class="content">{{ info.employer_comments.extra.label.join('、') }}</div>
            </div>
            <div class="item">
              <div class="label">内容</div>
              <div class="content">{{ info.employer_comments.content }}</div>
            </div>
            <div class="item">
              <div class="label">图片</div>
              <div v-if="info.employer_comments.attach_list.length" class="content clearfix">
                <el-image
                  v-for="(item, index) in info.employer_comments.attach_list"
                  :key="index"
                  style="width: 100px; height: 100px; float: left; margin-right: 10px; margin-bottom: 10px"
                  :src="item"
                  :preview-src-list="info.employer_comments.attach_list"
                >
                </el-image>
              </div>
              <div v-else class="content">无</div>
            </div>
          </div>
          <div v-else class="empty">暂未评价</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getDetail } from '@/api/task/index'
export default {
  name: 'TaskDetail',
  data() {
    return {
      order_no: ' ',
      info: {
        address_list: [],
        text: {},
        services: {},
        user: {},
        helper: {},
        helper_comments: null,
        employer_comments: null,
        quoted_list: [],
        time_lines: [],
        pay_logs: []
      }
    }
  },
  computed: {
    // 悬赏任务
    isGeneralTask() {
      return Number(this.info.order_type) === this.$settings.TASK_TYPE_GENERAL
    },
    // 竞价任务
    isCompetitionTask() {
      return Number(this.info.order_type) === this.$settings.TASK_TYPE_COMPETITION
    },
    // 没有帮手时显示信息
    noHelper() {
      if (this.isGeneralTask) {
        return '暂无帮手接单'
      } else if (this.isCompetitionTask) {
        return (this.info.bidding_list && this.info.bidding_list.length) ? '还未选择报价帮手' : '暂无帮手报价'
      } else {
        return ''
      }
    },
    // 任务图片/视频
    taskAttachList() {
      return this.info.text.attachment_url_list ? JSON.parse(this.info.text.attachment_url_list) : []
    },
    // 任务图片集
    taskAttachImageList() {
      const images = []
      for (const i in this.taskAttachList) {
        if (this.taskAttachList[i].type === 'image') {
          images.push(this.taskAttachList[i].url)
        }
      }
      return images
    }
  },
  created() {
    this.orderNo = this.$route.params.id
    this.init()
  },
  methods: {
    init() {
      getDetail(this.orderNo).then(res => {
        this.info = res.data
      })
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

  .time-desc {
    margin-top: 8px;
    font-size: 12px;
    color: #666;
  }
</style>
