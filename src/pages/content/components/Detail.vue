<template>
  <div id="article-detail">
    <div class="box">
      <div v-if="isShow('title')" class="title">{{ info.title }}</div>

      <div v-if="isShow('created_at') || isShow('author') || isShow('hits') || isShow('tag')" class="info flex">
        <div v-if="isShow('created_at')" class="created_at">{{ info.created_at || '现在' }}</div>
        <div v-if="isShow('author')" class="author">作者：{{ info.author }}</div>
        <div v-if="isShow('hits')" class="hits">阅读数：{{ info.hits || 0 }}</div>
        <!--        <div class="hits" v-if="isShow('category')"><el-link type="primary" class="link">{{ info.category.name }}</el-link></div>-->
        <div v-if="isShow('tag')" class="tag">
          <span v-for="(tag, index) in info.tag" :key="index">{{ tag }}</span>
        </div>
      </div>

      <div v-if="isShow('summary')" class="summary">
        {{ info.summary }}
      </div>

      <div v-if="isShow('content')" class="content" v-html="info.content" />

      <div v-if="isShow('photos') && info.photos.length" class="photos">
        <el-carousel trigger="click" :autoplay="false" :height="photosHeight">
          <el-carousel-item v-for="(item, index) in info.photos" :key="index">
            <el-image :src="item.url" fit="scale-down" class="photo" />
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>

    <div v-if="isShow('relation')" class="box">
      <div class="sub-title">
        相关文章
        <el-link type="primary" class="link">更多>></el-link>
      </div>
      <div class="list">
        <component :is="list" :fields="category.list_fields" :cover-size="category.cover_size" />
      </div>
    </div>
  </div>
</template>

<script>
import defaultImg from '@/assets/404_images/404.png'
import List1 from '@/pages/content/components/List1'
import List2 from '@/pages/content/components/List1'
import List3 from '@/pages/content/components/List3'
import List4 from '@/pages/content/components/List1'

export default {
  name: 'Detail',
  components: { List1, List2, List3, List4 },
  props: {
    info: {
      type: Object,
      default() {
        return {
          title: '我是标题',
          created_at: '2020-01-01 00:00:01',
          author: '佚名',
          hits: 0,
          tag: ['标签'],
          summary: '我是摘要我是摘要我是摘要我是摘要我是摘要我是摘要我是摘要我是摘要我是摘要我是摘要我是摘要我是摘要我是摘要我是摘要',
          content: '我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容',
          photos: [{
            name: '',
            url: defaultImg
          }, {
            name: '',
            url: defaultImg
          }, {
            name: '',
            url: defaultImg
          }],
          category: {
            id: 1,
            name: '分类'
          }
        }
      }
    },
    fields: {
      type: Array,
      default() {
        return ['title', 'created_at', 'author', 'hits', 'tag', 'content', 'photos', 'category']
      }
    },
    category: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    photosHeight() {
      return this.category.photo_size + 'px'
    },
    list() {
      return this.category.list_type ? 'List' + this.category.list_type : ''
    }
  },
  methods: {
    isShow(val) {
      return this.fields.indexOf(val) >= 0
    }
  }
}
</script>

<style scoped>
  .box {
    background-color: #fff;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }
  .title {
    font-size: 18px;
    padding: 10px 10px 0;
  }
  .info {
    padding: 10px 5px 0;
    font-size: 12px;
    color: #999999;
  }
  .info>div {
    padding: 0 5px;
  }
  .info>div+div{
    border-left: solid 1px #ddd;
  }
  .summary {
    margin: 10px 10px 0;
    padding: 10px;
    font-size: 13px;
    line-height: 1.3;
    background-color: #f8f8f8;
    border-right: 4px;
  }
  .content {
    padding: 10px 10px 0;
    font-size: 14px;
    line-height: 1.3;
  }
  .photos {
    margin-top: 10px;
    text-align: center;
  }
  .photo {
    width: 100%;
    height: 100%;
    background-color: #F8F8F8;
  }
  .sub-title {
    font-size: 16px;
    padding: 10px 10px 0;
  }
  .sub-title .link{
    float: right;
    font-size: 12px;
    color: #3A71A8;
    line-height: 14px;
  }
  .tag span+span{
    margin-left: 5px;
  }
</style>

<style>
  #article-detail .content img {
    max-width: 100%;
  }
</style>
