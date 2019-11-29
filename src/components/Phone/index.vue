<template>
  <div class="phone">
    <div class="phone-header" />
    <div class="phone-screen" :class="{phone_no_menu: !hasMenus}" :style="{paddingBottom: hasMenus ? '50px' : '0'}">
      <div class="phone-top" :style="{backgroundColor: navigationBackgroundColor}">
        <div class="phone-title">{{ title }}</div>
      </div>
      <div class="phone-box" :style="{backgroundColor: backgroundColor}">
        <slot />
      </div>
      <ul v-if="hasMenus" class="phone-nav">
        <li v-for="(item, index) in menus" :key="index">{{ item.name }}</li>
      </ul>
    </div>
    <slot name="footer">
      <div class="phone-footer" />
    </slot>
  </div>
</template>

<script>
export default {
  name: 'Phone',
  props: {
    topImg: {
      type: String,
      default: () => {
        // return require('@/assets/images/wxapp-top.png')
      }
    },
    title: {
      type: String,
      default: '页面标题'
    },
    hasMenus: {
      type: Boolean,
      default: false
    },
    navigationBackgroundColor: {
      type: String,
      default: '#FFFFFF'
    },
    backgroundColor: {
      type: String,
      default: '#F8F8F8'
    },
    menus: {
      type: Array,
      default: () => {
        return [
          { name: '菜单一' },
          { name: '菜单二' },
          { name: '菜单三' },
          { name: '菜单四' }
        ]
      }
    }
  },
  data() {
    return {}
  }
}
</script>

<style scoped>
  .phone {border: solid 1px #ddd; border-radius: 20px; padding: 10px 3px; background-color: #ffffff; width: 385px; box-shadow: 0 2px 6px 0 rgba(0,0,0,0.1)}
  .phone-header {height: 24px; position: relative}
  .phone-header:before {content: ' '; position: absolute; top: 5px; left: 157px; height: 8px; width: 8px; background-color: #ddd; border-radius: 8px}
  .phone-header:after {content: ' '; position: absolute; top: 5px; left: 170px; height: 8px; width: 50px; background-color: #ddd; border-radius: 8px}
  .phone-footer {height: 40px; width: 40px; margin: 10px auto 0; border: solid 1px #ddd; border-radius: 20px; text-align: center; box-shadow: inset 0 0px 6px 0 rgba(0,0,0,0.1)}
  .phone-screen {border: solid 1px #ddd; height: 667px; box-sizing: border-box; padding: 44px 0 50px; position: relative}
  .phone-screen.phone_no_menu {padding-bottom: 0}
  .phone-screen .phone-top {position: absolute; top: 0; left: 0; width: 100%; height: 44px; background: center no-repeat; background-size: 100% 100%; box-sizing: border-box; padding: 7px 0; border-bottom: solid 1px #ddd}
  .phone-screen .phone-top .phone-title {text-align: center; color: #000000; font-size: 16px; line-height: 30px; font-weight: 500}
  .phone-screen .phone-nav {position: absolute; left: 0; bottom: 0; width: 100%; height: 50px; border-top: 1px solid #e5e5e5; list-style: none; font-size: 14px}
  .phone-screen .phone-nav>li {float: left; width: 25%; height: 50px; box-sizing: border-box; padding-top: 30px; text-align: center; position: relative}
  .phone-screen .phone-nav>li:before {content: ' '; display: block; position: absolute; width: 24px; height: 24px; border-radius: 13px; background-color: #ddd; left: 50%; top: 2px; margin-left: -12px}
  .phone-box {width: 100%; height: 100%; overflow-y: auto; overflow-x: hidden}
  .phone-content {min-height: 100%; box-sizing: border-box; position: relative}

  .phone-box::-webkit-scrollbar {
    /*滚动条整体样式*/
    width : 8px;  /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }
  .phone-box::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius   : 10px;
    background-color: skyblue;
    background-image: -webkit-linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.2) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0.2) 75%,
      transparent 75%,
      transparent
    );
  }
  .phone-box::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
    background   : #ededed;
    border-radius: 10px;
  }
</style>
