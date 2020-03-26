<template>
  <el-form ref="dataForm" label-width="120px" label-position="left" size="mini">
    <el-form-item label="姓名">
      {{ info.name }}
    </el-form-item>
    <el-form-item label="身份证">
      {{ info.idcard }}
    </el-form-item>
    <el-form-item label="性别">
      {{ info.sex }}
    </el-form-item>
    <el-form-item label="民族">
      {{ info.nation }}
    </el-form-item>
    <el-form-item label="出生日期">
      {{ info.birth }}
    </el-form-item>
    <el-form-item label="地址">
      {{ info.address }}
    </el-form-item>
    <el-form-item label="证件有效期">
      {{ info.validDate }}
    </el-form-item>
    <el-form-item label="发证机关">
      {{ info.authority }}
    </el-form-item>
    <el-form-item label="人像面照片">
      <el-image class="map" :src="info.frontPhoto" fit="cover" />
    </el-form-item>
    <el-form-item label="国徽面照片">
      <el-image class="map" :src="info.backPhoto" fit="cover" />
    </el-form-item>
    <el-form-item label="身份证头像照片">
      <el-image class="map" :src="info.headPhoto" fit="cover" />
    </el-form-item>
    <el-form-item label="活体检测得分">
      {{ info.liveRate }}
    </el-form-item>
    <el-form-item label="人脸比对得分">
      {{ info.similarity }}
    </el-form-item>
    <el-form-item label="扫脸照片">
      <el-image class="map" :src="info.photo" fit="cover" />
    </el-form-item>
  </el-form>
</template>

<script>
import { getUserCertification } from '@/api/user/user'
export default {
  name: 'UserCertification',
  props: {
    userId: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      info: {}
    }
  },
  watch: {
    userId() {
      this.loadData()
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      if (!this.userId) return
      getUserCertification(this.userId).then(res => {
        this.info = res.data
      })
    }
  }
}
</script>

<style scoped>

</style>
