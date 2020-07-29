<p align="left">
<a href="https://250.cn">
<img src="https://www.250.cn/static/250/images/logo.png" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework">
<img src="https://poser.pugx.org/laravel/framework/license.svg" alt="License">
</a>
</p>

## About 流光星际

流光星际（湖北）科技有限公司，成立于2019年，我们公司致力于互联网技术的开发与运用，从而实现指尖上互联网的人机交互，为人们生活的方方面面带来便利。我们以卓越的品质、专业的技术服务实力，为不同群体的用户提供更优质的服务。

- [我们的官网](https://250.cn).

## About 本项目
本项目是“全民帮帮”项目管理后台前端代码。基于vue-element-admin模板开发

## 环境需求
1. 操作系统 windows/linux
2. Nodejs 6.11.5及以上

## 说明
本项目是“全民帮帮”项目的管理后台前端代码，“全民帮帮”是前后端分享架构，故本项目需要[后端仓库](https://github.com/lgxj/SuperCooperationAPI)支持

## 功能

```
- 登录 / 注销

- 权限验证
  - 页面权限
  - 指令权限

- 权限管理
  - 角色列表
  - 管理员列表
  - 操作日志

- 内容管理
  - 文章分类
  - 文章 列表

- 系统管理
  - 配置管理
  - APP更新管理

- 用户管理
  - 用户列表
  - 用户反馈
  - 客服列表
  - 用户定位

- 任务管理
  - 发单列表
  - 接单列表
  - 任务分类

- 账务管理
  - 提现列表
  - 支付列表
  - 退款列表
  - 流水记录
  - 收费管理
  - 账户管理

- 统计管理
  - 任务统计
```

## 开发

```bash
# clone the project
git clone https://github.com/lgxj/SuperCooperationAdmin.git

# enter the project directory
cd SuperCooperationAdmin

# install dependency
npm install

# develop
npm run dev
```

浏览器访问：http://localhost:9527

## 配置
修改`.env.development`和`.env.production`中`VUE_APP_BASE_API`为测试或正式接口地址  
修改`src/settings.js`中`appId`、`appSecret`为正确值(在后端项目配置匹配)

## 发布

```bash
# build for test environment
npm run build:stage

# build for production environment
npm run build:prod
```

[体验地址](http://sc-admin.250.cn/)

## 联系我们
![图片](https://freshoss.oss-cn-chengdu.aliyuncs.com/freshoss/qr-code.png)

