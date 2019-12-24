<template>
  <div class="upload-container">
    <el-button :style="{background:color,borderColor:color}" icon="el-icon-upload" size="mini" type="primary" @click=" dialogVisible=true">
      上传图片
    </el-button>
    <el-dialog title="图片上传" :visible.sync="dialogVisible">
      <!--<el-upload
        name="image"
        :multiple="true"
        :file-list="fileList"
        :show-file-list="true"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        class="editor-slide-upload"
        :action="uploadImgApiPath"
        :headers="headers"
        list-type="picture-card"
      >
        <i class="el-icon-plus"></i>
      </el-upload>-->
      <my-upload :multiple="true" :max="9" @change="handleImgChange" />
      <el-button @click="dialogVisible = false">
        取消
      </el-button>
      <el-button type="primary" @click="handleSubmit">
        确定
      </el-button>
    </el-dialog>
  </div>
</template>

<script>
// import { getToken } from 'api/qiniu'

import { uploadImgApiPath, appId } from '@/settings'
import { makeParamSource, sign } from '@/utils'
import MyUpload from '@/components/MyUpload'

export default {
  name: 'EditorSlideUpload',
  components: { MyUpload },
  props: {
    color: {
      type: String,
      default: '#1890ff'
    }
  },
  data() {
    return {
      dialogVisible: false,
      listObj: {},
      fileList: [],
      uploadImgApiPath
    }
  },
  computed: {
    headers() {
      const headers = {}
      headers[ 'SC-API-APP'] = appId
      const signSource = makeParamSource()
      headers[ 'SC-API-SIGNATURE'] = sign(signSource)
      if (this.$store.getters.token) {
        headers['SC-ACCESS-TOKEN'] = this.$store.getters.token
      }
      return headers
    }
  },
  methods: {
    handleImgChange(e) {
      this.listObj = Object.values(e)
    },
    checkAllSuccess() {
      return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
    },
    handleSubmit() {
      const arr = Object.keys(this.listObj).map(v => this.listObj[v])
      if (!this.checkAllSuccess()) {
        this.$message('请等待所有图片成功上载。如果有网络问题，请刷新页面并重新上传！')
        return
      }
      this.$emit('successCBK', arr)
      this.listObj = {}
      this.fileList = []
      this.dialogVisible = false
    },
    handleSuccess(response, file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          this.listObj[objKeyArr[i]].url = response.files.file
          this.listObj[objKeyArr[i]].hasSuccess = true
          return
        }
      }
    },
    handleRemove(file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          delete this.listObj[objKeyArr[i]]
          return
        }
      }
    },
    beforeUpload(file) {
      const _self = this
      const _URL = window.URL || window.webkitURL
      const fileName = file.uid
      this.listObj[fileName] = {}
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = _URL.createObjectURL(file)
        img.onload = function() {
          _self.listObj[fileName] = { hasSuccess: false, uid: file.uid, width: this.width, height: this.height }
        }
        resolve(true)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

<style>
  .upload-container .editor-slide-upload .el-upload {
   width: 148px !important;
   margin: 0 8px 8px 0;
}
</style>
