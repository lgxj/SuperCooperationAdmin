<template>
  <div class="list-box">
    <div v-for="i in 3" :key="i" class="list flex">
      <div class="flex-auto">
        <div v-if="isShow('title')" class="title">{{ info.title }}</div>
        <div v-if="isShow('summary')" class="summary">
          {{ info.summary }}
        </div>
        <div class="info flex">
          <div v-if="isShow('created_at')" class="created_at">{{ info.created_at }}</div>
          <div v-if="isShow('author')" class="author">作者：{{ info.author }}</div>
          <div v-if="isShow('hits')" class="hits">阅读数：{{ info.hits }}</div>
          <div v-if="isShow('tag')" class="tag">
            <span v-for="(tag, index) in info.tag" :key="index">{{ tag }}</span>
          </div>
        </div>
      </div>
      <div v-if="isShow('cover')" class="cover-box flex-none">
        <el-image :src="info.cover" fit="cover" :style="coverStyle" class="cover" />
      </div>
    </div>
  </div>
</template>

<script>
import defaultImg from '@/assets/404_images/404.png'
export default {
  name: 'List1',
  props: {
    info: {
      type: Object,
      default() {
        return {
          title: '我是标题',
          created_at: '今天',
          author: '佚名',
          hits: 0,
          tag: ['标签'],
          summary: '我是摘要我是摘要我是摘要我是摘要我是摘要我是摘要我是摘要',
          cover: defaultImg
        }
      }
    },
    fields: {
      type: Array,
      default() {
        return ['title', 'created_at', 'author', 'hits', 'tag', 'summary', 'cover']
      }
    },
    coverSize: {
      type: Number,
      default: 200
    }
  },
  computed: {
    coverStyle() {
      return { width: this.coverSize + 'px', maxWidth: '100%' }
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
  @import 'list.css';
</style>
