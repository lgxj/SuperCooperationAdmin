<template>
  <div class="flex box app-container">
    <div class="flex-auto">
      <el-card class="box-card">
        <el-form ref="dataForm" :model="info" :rules="rules" label-width="120px" label-position="left">
          <el-form-item label="分类" prop="category_id">
            <el-select v-model="info.category_id" placeholder="请选择分类" clearable>
              <el-option
                v-for="(item, index) in category"
                :key="index"
                :label="item.name"
                :value="item.article_category_id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="标题" prop="title">
            <el-input v-model="info.title" placeholder="请输入标题" />
          </el-form-item>
          <el-form-item label="内容类型" prop="list_fields">
            <el-radio-group v-model="info.content_type">
              <el-radio v-for="(item, index) in contentType" :key="index" :label="index">{{ item }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="outsideContent" label="链接" prop="link">
            <el-input v-model="info.link" placeholder="请输入链接地址">
              <template slot="prepend">http://</template>
            </el-input>
          </el-form-item>
          <el-form-item v-if="isShowField('author')" label="作者" prop="author">
            <el-input v-model="info.author" placeholder="请输入作者" />
          </el-form-item>
          <el-form-item v-if="isShowField('tag')" label="标签" prop="tag">
            <el-tag
              v-for="(tag, index) in info.tag"
              :key="index"
              closable
              :disable-transitions="false"
              @close="handleRemoveTag(tag)"
            >
              {{ tag }}
            </el-tag>
            <el-input
              v-if="inputTagVisible"
              ref="saveTagInput"
              v-model="inputTagValue"
              class="input-new-tag"
              size="mini"
              @keyup.enter.native="handleInputTagConfirm"
              @blur="handleInputTagConfirm"
            />
            <el-button v-else class="button-new-tag" size="mini" @click="showInputTag">+ 增加</el-button>
          </el-form-item>
          <el-form-item v-if="isShowField('cover')" label="封面图" prop="cover">
            <my-upload :file-list="cover" @change="handleCoverChange" />
          </el-form-item>
          <el-form-item v-if="insideContent && isShowField('photos')" label="图集" prop="photos">
            <my-upload :multiple="true" :max="9" :file-list="photos" @change="handlePhotosChange" />
          </el-form-item>
          <el-form-item v-if="isShowField('summary')" label="摘要" prop="summary">
            <el-input
              v-model="info.summary"
              type="textarea"
              :rows="2"
              placeholder="请输入摘要"
              autosize
            />
          </el-form-item>
          <el-form-item v-if="insideContent && isShowField('content')" label="内容" prop="content">
            <tinymce v-model="info.content" :height="300" />
          </el-form-item>
          <el-form-item label="排序" prop="sort" style="width: 250px">
            <el-input v-model="info.sort" type="number" placeholder="请输入排序" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="saving" @click="save">{{ btnText }}</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <div class="flex-none ml-10">
      <sticky :sticky-top="104">
        <phone :title="info.title || '文章详情'">
          <detail v-if="insideContent" :info="info" :fields="currentCategory.detail_fields" :category="currentCategory" />
        </phone>
      </sticky>
    </div>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Sticky from '@/components/Sticky'
import Phone from '@/components/Phone'
import MyUpload from '@/components/MyUpload'
import Detail from '@/pages/content/components/Detail'
import { add, edit, getDetail } from '@/api/article'
import { getAll as getCategory } from '@/api/article-category'
import { findArrayByItem } from '@/utils'

const contentType = {
  1: '内部内容',
  2: '外部链接'
}

export default {
  name: 'ContentArticleDetail',
  components: { Phone, Detail, Tinymce, MyUpload, Sticky },
  data() {
    return {
      id: '',
      info: {
        category_id: '',
        title: '',
        content_type: '1',
        link: '',
        tag: [],
        author: '',
        summary: '',
        cover: '',
        photos: [],
        content: '',
        sort: 0
      },
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'change' }],
        category_id: [{ required: true, message: '请选择分类', trigger: 'change' }],
        content_type: [{ required: true, message: '请选择内容类型', trigger: 'change' }],
        author: [{ required: true, message: '请输入作者', trigger: 'change' }],
        summary: [{ required: true, message: '请输入摘要', trigger: 'change' }],
        content: [{ required: true, message: '请输入内容', trigger: 'change' }],
        link: [{ required: true, message: '请输入外部链接', trigger: 'change' }]
      },
      contentType,
      category: [],
      saving: false,
      cover: [],
      photos: [],
      inputTagVisible: false,
      inputTagValue: ''
    }
  },
  computed: {
    btnText() {
      return this.id ? '修改' : '创建'
    },
    currentCategory() {
      return findArrayByItem(this.category, 'article_category_id', this.info.category_id) || {
        list_fields: [],
        detail_fields: [],
        cover_size: 145,
        photo_size: 150
      }
    },
    insideContent() {
      return this.info.content_type === '1'
    },
    outsideContent() {
      return this.info.content_type === '2'
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.loadCategory()
      this.id = this.$route.params.id
      if (this.id) {
        this.loadData()
      }
    },
    loadCategory() {
      getCategory().then(res => {
        this.category = res.data
      })
    },
    loadData() {
      getDetail(this.id).then(res => {
        res.data.content_type = String(res.data.content_type)
        this.info = res.data
        this.cover = this.info.cover ? [
          {
            url: this.info.cover,
            name: ''
          }] : []
        this.photos = this.info.photos
      })
    },
    isShowField(field) {
      return this.currentCategory ? this.currentCategory.list_fields.indexOf(field) >= 0 ||
        this.currentCategory.detail_fields.indexOf(field) >= 0 : false
    },
    handleRemoveTag(tag) {
      this.info.tag.splice(this.info.tag.indexOf(tag), 1)
    },
    showInputTag() {
      this.inputTagVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputTagConfirm() {
      const inputTagValue = this.inputTagValue
      if (inputTagValue) {
        this.info.tag.push(inputTagValue)
      }
      this.inputTagVisible = false
      this.inputTagValue = ''
    },
    handleCoverChange(e) {
      const img = Object.values(e)[0]
      if (img) {
        this.info.cover = img.path
      } else {
        this.info.cover = ''
      }
    },
    handlePhotosChange(e) {
      this.info.photos = Object.values(e).map(img => {
        return {
          name: img.name,
          url: img.url,
          path: img.path
        }
      })
    },
    save() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.saving = true
          if (this.id) {
            edit(this.info).then(res => {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.saving = false
            })
          } else {
            add(this.info).then(res => {
              this.id = res.data.article_id
              this.info.article_id = res.data.article_id
              this.$message({
                message: '创建成功',
                type: 'success'
              })
              this.saving = false
            })
          }
        }
      })
    }
  }
}
</script>

<style scoped>
  .el-tag + .el-tag {
    margin-left: 10px;
  }

  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
