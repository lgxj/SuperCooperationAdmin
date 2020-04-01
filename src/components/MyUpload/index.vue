<template>
  <div>
    <el-upload
      ref="upload"
      :name="name"
      :multiple="multiple"
      :file-list="formatPath(listObj)"
      :show-file-list="showFileList"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
      :on-exceed="handleExceed"
      :on-error="handleError"
      :on-preview="handlePictureCardPreview"
      class="editor-slide-upload"
      :action="uploadImgApiPath"
      :headers="headers"
      :list-type="listType"
      :limit="max"
      :data="postData"
      :accept="accept"
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
import { uploadImgApiPath, appId } from '@/settings'
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
    },
    directory: {
      type: String,
      default: ''
    },
    businessType: {
      type: [Number, String],
      default: 0
    },
    accept: {
      type: String,
      default: 'image/*'
    }
  },
  data() {
    return {
      listObj: {},
      uploadImgApiPath,
      dialogImageUrl: '',
      dialogVisible: false,
      postData: {}
    }
  },
  computed: {
    headers() {
      const headers = {}
      headers[ 'SC-API-APP'] = appId
      const signSource = makeParamSource(this.postData)
      headers[ 'SC-API-SIGNATURE'] = sign(signSource)
      if (this.$store.getters.token) {
        headers['SC-ACCESS-TOKEN'] = this.$store.getters.token
      }
      return headers
    }
  },
  watch: {
    fileList(val) {
      this.listObj = val.map(item => {
        return {
          url: item.url,
          path: item.path
        }
      })
    }
  },
  created() {
    this.listObj = this.fileList.map(item => {
      return {
        url: item.url,
        path: item.path
      }
    })
    this.postData = {
      directory: this.directory,
      businessType: this.businessType
    }
  },
  methods: {
    formatPath(list) {
      return Object.values(list)
    },
    handleSuccess(response, file) {
      if (!response.success) {
        this.$refs.upload.abort(file)
        return this.$message.error(response.message)
      }
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          this.listObj[objKeyArr[i]].url = response.data.image
          this.listObj[objKeyArr[i]].path = response.data.image
          this.listObj[objKeyArr[i]].name = file.name
          this.listObj[objKeyArr[i]].hasSuccess = true
        }
      }
      this.$emit('change', this.listObj)
    },
    handleError(err, file, fileList) {
      console.log('上传文件失败', err)
    },
    handleRemove(file, fileList) {
      const list = fileList.filter(item => {
        return item.status === 'success'
      }).map(item => {
        return {
          url: item.url,
          path: item.path
        }
      })
      delete this.listObj[file.uid]
      return this.$emit('change', list)
    },
    beforeUpload(file) {
      if (this.beforeUploadAction) {
        this.beforeUploadAction(file)
        return false
      }
      const _self = this
      const _URL = window.URL || window.webkitURL
      const fileName = file.uid
      this.listObj[fileName] = {
        hasSuccess: false,
        uid: file.uid
      }
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
        message: '最多上传' + this.max + '个文件'
      })
    },
    handlePictureCardPreview(file) {
      if (this.listType === 'text') return
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  }
}
</script>

<style scoped>

</style>
