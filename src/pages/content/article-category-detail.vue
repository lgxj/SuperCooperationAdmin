<template>
  <div class="flex box app-container">
    <div class="flex-auto">
      <el-card class="box-card">
        <el-form ref="dataForm" :model="info" :rules="rules" label-width="120px" label-position="left">
          <el-form-item label="名称" prop="name">
            <el-input v-model="info.name" placeholder="请输入名称" />
          </el-form-item>
          <el-form-item label="列表样式" prop="list_type">
            <el-select v-model="info.list_type" placeholder="请选择分组" clearable>
              <el-option v-for="(item, index) in listType" :key="index" :label="item" :value="index" />
            </el-select>
          </el-form-item>
          <el-form-item label="列表显示字段" prop="list_fields">
            <el-checkbox-group v-model="info.list_fields">
              <el-checkbox v-for="item in listFields" :key="item.value" :label="item.value">{{ item.label }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="详情显示字段" prop="detail_fields">
            <el-checkbox-group v-model="info.detail_fields">
              <el-checkbox v-for="item in detailFields" :key="item.value" :label="item.value">{{ item.label }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item v-if="isShowField('cover')" label="封面图宽度" prop="cover_size">
            <el-input v-model="info.cover_size" placeholder="请输入宽度" style="width: 160px">
              <template slot="append">px</template>
            </el-input>
          </el-form-item>
          <el-form-item v-if="isShowField('photos')" label="图片集高度" prop="photo_size">
            <el-input v-model="info.photo_size" placeholder="请输入高度" style="width: 160px">
              <template slot="append">px</template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="saving" @click="save">{{ btnText }}</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <div class="flex-none ml-10">
      <phone :title="info.name || '文章列表'">
        <component :is="list" :fields="info.list_fields" :cover-size="info.cover_size" />
      </phone>
    </div>

    <div class="flex-none ml-10">
      <phone title="文章详情">
        <detail :fields="info.detail_fields" :category="info" />
      </phone>
    </div>
  </div>
</template>

<script>
import Phone from '@/components/Phone'
import List1 from '@/pages/content/components/List1'
import List2 from '@/pages/content/components/List2'
import List3 from '@/pages/content/components/List3'
import List4 from '@/pages/content/components/List4'
import Detail from '@/pages/content/components/Detail'
import { listType } from '@/utils/const'
import { add, edit, getDetail } from '@/api/article-category'

const listFields = [
  { label: '标题', value: 'title' },
  { label: '时间', value: 'created_at' },
  { label: '作者', value: 'author' },
  { label: '点击量', value: 'hits' },
  { label: '标签', value: 'tag' },
  { label: '摘要', value: 'summary' },
  { label: '封面图', value: 'cover' }
]

const detailFields = [
  { label: '标题', value: 'title' },
  { label: '时间', value: 'created_at' },
  { label: '作者', value: 'author' },
  { label: '点击量', value: 'hits' },
  { label: '标签', value: 'tag' },
  // { label: '分类', value: 'category' },
  { label: '摘要', value: 'summary' },
  { label: '内容', value: 'content' },
  { label: '图集', value: 'photos' },
  { label: '相关文章', value: 'relation' }
]

export default {
  name: 'ContentArticleCategoryDetail',
  components: { Phone, List1, List2, List3, List4, Detail },
  data() {
    return {
      id: '',
      info: {
        list_fields: [],
        detail_fields: [],
        cover_size: 145,
        photo_size: 150
      },
      listType,
      listFields,
      detailFields,
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'change' }],
        list_type: [{ required: true, message: '请选择列表样式', trigger: 'change' }],
        list_fields: [{ required: true, message: '请选择列表显示字段', trigger: 'change' }],
        detail_fields: [{ required: true, message: '请选择详情显示字段', trigger: 'change' }],
        cover_size: [{ required: true, message: '请输入封面图宽度', trigger: 'change' }],
        photo_size: [{ required: true, message: '请输入架图集高度', trigger: 'change' }]
      },
      saving: false
    }
  },
  computed: {
    list() {
      return this.info.list_type ? 'List' + this.info.list_type : ''
    },
    btnText() {
      return this.id ? '修改' : '创建'
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.id = this.$route.params.id
      if (this.id) {
        this.loadData()
      }
    },
    loadData() {
      getDetail(this.id).then(res => {
        this.info = res.data
        this.info.list_type = String(this.info.list_type)
      })
    },
    isShowField(field) {
      return this.info.list_fields.indexOf(field) >= 0 || this.info.detail_fields.indexOf(field) >= 0
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
              this.id = res.data.article_category_id
              this.info.article_category_id = res.data.article_category_id
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
  .box {
    padding: 10px;
  }
</style>
