<template>
  <div>
    <el-upload
      :name="name"
      :multiple="multiple"
      :file-list="formatPath(fileList)"
      :show-file-list="showFileList"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
      :on-exceed="handleExceed"
      :on-preview="handlePictureCardPreview"
      class="editor-slide-upload"
      :action="uploadImgApiPath"
      :headers="headers"
      :list-type="listType"
      :limit="max"
    >
      <slot>
        <i class="el-icon-plus" />
      </slot>
    </el-upload>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { uploadImgApiPath, appId, uploadImgDomain } from '@/settings'
import { makeParamSource, sign } from '@/utils'
export default {
  name: 'MyUpload',
  props: {
    name: {
      type: String,
      default: 'image'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    fileList: {
      type: Array,
      default() {
        return []
      }
    },
    showFileList: {
      type: Boolean,
      default: true
    },
    listType: {
      type: String,
      default: 'picture-card'
    },
    max: {
      type: Number,
      default: 1
    },
    beforeUploadAction: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      listObj: {},
      uploadImgApiPath,
      dialogImageUrl: '',
      dialogVisible: false
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
    formatPath(list) {
      return list.map(item => {
        item.url = item.url.indexOf('http') === 0 ? item.url : (uploadImgDomain + '/' + item.url)
        return item
      })
    },
    handleSuccess(response, file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          this.listObj[objKeyArr[i]].url = response.data.fullPath
          this.listObj[objKeyArr[i]].path = response.data.path
          this.listObj[objKeyArr[i]].name = file.name
          this.listObj[objKeyArr[i]].hasSuccess = true
        }
      }
      this.$emit('change', this.listObj)
    },
    handleRemove(file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          console.log('delete', objKeyArr[i])
          delete this.listObj[objKeyArr[i]]
        }
      }
      this.$emit('change', this.listObj)
    },
    beforeUpload(file) {
      if (this.beforeUploadAction) {
        this.beforeUploadAction(file)
        return false
      }
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
    },
    handleExceed() {
      this.$message({
        type: 'error',
        message: '最多上传' + this.max + '张图片'
      })
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  }
}
</script>

<style scoped>

</style>
