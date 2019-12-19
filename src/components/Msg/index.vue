<template>
  <div>
    <el-badge :is-dot="isDot" style="line-height: 25px;">
      <i class="el-icon-message-solid size" @click="toMsg" />
    </el-badge>
  </div>
</template>

<script>
export default {
  name: 'Msg',
  computed: {
    isDot: {
      get() {
        return this.$store.state.msg.num > 0
      }
    }
  },
  methods: {
    toMsg() {
      this.$router.push('/message/im')
    }
  }
}
</script>

<style>
  .size {
    font-size: 20px;
  }
</style>
