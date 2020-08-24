# 简介（Introduction）- uni-pushy-server

`uni-pushy` uni-app 热更新管理平台。

这是 `uni-pushy` 的后端仓库。Github：[uni-pushy-server](https://github.com/SunSeekerX/uni-pushy-server)

基于 `nestjs` +`typeorm`+`redis`+`mysql`+`jsonwebtoken`+`class-validator`+`restful`。

**配套前端**：[uni-pushy-admin](https://github.com/SunSeekerX/uni-pushy-admin)

**预览地址**：[https://uni-pushy.yoouu.cn/](https://uni-pushy.yoouu.cn/)

> 自行注册账号使用即可体验

**预览文档**：[https://api.uni-pushy.yoouu.cn/docs/](https://api.uni-pushy.yoouu.cn/docs/)

> **uni-app App整包升级检测：** https://ask.dcloud.net.cn/article/34972
>
> **uni-app App资源热更新：** https://ask.dcloud.net.cn/article/35667



# ❗ 注意（Notice）

目前应用仍然处于开发阶段，不排除出现重大 `bug` 的可能性。



# 快速上手（Getting Started）

克隆仓库（Clone this repo）

```bash
git clone https://github.com/SunSeekerX/uni-pushy-server.git
```

进入项目目录

```bash
cd uni-pushy-server/
```

安装依赖 （Install dependencies），项目根目录下执行

```bash
npm i
# 或者
yarn
```

> 国内网络安装过慢可以安装 `tbify`， 使用说明：[tbify](https://sunseekerx.yoouu.cn/front-end/npm/#📂-tbify)



## 开发（dev）

配置环境变量（Set env）,根目录下执行

```bash
mv .env.example .env.development
```

打开 `.env.development`，填写环境变量

```shell
# Server
SERVER_PORT=
PRO_DOC=

# OSS Config
OSS_ACCESSKEYID=
OSS_ACCESSKEYSECRET=
OSS_REGION=
OSS_BUCKET=
OSS_BASE_URL=

# DATABASE Config
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_DATABASE=

# Redis config
REDIS_HOST=
REDIS_PORT=
REDIS_DB=
REDIS_PASSWORD=
REDIS_PRIFIX=

# Token Secret
TOKEN_SECRET=

# Api sign
API_SIGN_RSA_PRIVATE_KEY=
API_SIGN_TIME_OUT=

# Time zone
TZ=Asia/Shanghai

```

**示例**

```shell
# Server
SERVER_PORT=8081
PRO_DOC=true

# OSS Config
OSS_ACCESSKEYID=xxxxx
OSS_ACCESSKEYSECRET=xxxxx
OSS_REGION=oss-cn-hangzhou
OSS_BUCKET=uni-pushy
OSS_BASE_URL=https://uni-pushy.oss-cn-guanzhou.aliyuncs.com

# DATABASE Config
DB_HOST=192.192.192.192
DB_PORT=3306
DB_USER=uni-pushy
DB_PASSWORD=uni-pushy
DB_DATABASE=uni-pushy

# Redis config
REDIS_HOST=192.192.192.192
REDIS_PORT=6379
REDIS_DB=0
REDIS_PASSWORD=xxxxx
REDIS_PRIFIX=

# Token Secret
TOKEN_SECRET=your-secret-key

# Api sign
API_SIGN_RSA_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBALvlTV1G0b/q40bYbz/z2cV3tS10oxFiGkr7abO7HF0qp7NXrZMTxj/098sVF32IhOqliQOP9c4arcEFgpHr7mhek5j0xKR7u11DXY6bFKfhOVXdhl9e5s3mc5mhaPgD168txm6a0k+6TyQjHP2pKbzJis54tshfmR3Ley2XfGs3AgMBAAECgYAV6OUejVWEBYW/Cxnd4TdxmUXdKQ6ixke+mpZ2yMjD7GdluEGbNuEVMCF84ta8YqDtI6RYb/7/q4i7S0MwdMx1147YyCS9keZBliNsgnK3drDXAFlVYd1y5YLXrbDMgOiK5W6oIRCQ8455SiuhLd/60lGskeHis+hEhl3WLJ7CYQJBAPltCRSPrXeE5apbRLZq0zXcyUjmEakxe97bpzsjIE9XKwvCU8rISLA0s3HmUuEgqWXqwLvr8snM03WBduPrgQkCQQDA2RnKt2uBPLcZRs5aVo4SusJF9YjDFH/TAjutedOgxP6sYdmQ1iudyVgVE7dCeCKnnJti7rnJsGeXwWrG9to/AkB3+vgkONzjojzrzo1mBkrlHPiCJZGXRqNkV1rBOqtfHvoo5OhzohY9FIzBHF7/xjtWOC9P9jbK1cleO9GZ334pAkA3TkvKSj4Hi00Lb7YATHBkSLEsdRUqtTdPYYWR461gnv5Wm51Un0dU8ghTyxq0clWl8hDSF5qqj++1ot+nfeXrAkEAnMVbHK89dFYQ2yzEMIwF3R+VF0OY/v2ZtL72OOCRexnQ2ISPJokILYg52AH9Esbp8PKVXS5tQ9sQ/nyBsbr1wA==-----END PRIVATE KEY-----
API_SIGN_TIME_OUT=15

# Time zone
TZ=Asia/Shanghai
```



**启动**

```bash
npm run serve
```



## 部署（deploy）

[docker 部署](#docker 部署)



配置环境变量（Set env），根目录下执行

```bash
mv .env.example .env
```

打开  `.env`，填写环境变量，环境变量同开发。



**打包**

```bash
npm run build
```

打包完成生成的静态文件位于 `dist` 目录下，为 `nestjs` 项目。部署时需要带上 `.env` 环境变量文件，以及 `package.json` 依赖说明文件。同时依赖于 `nodejs`。

> 如果只是部署的话安装依赖可以只下载运行时依赖，使用如下命令
>
> ```bash
> npm i --production
> ```



**启动**

```bash
node dist/main
```



## uni-app 接入（uni-app deploy）

`uni-app` 插件来源：[https://ext.dcloud.net.cn/plugin?id=1643](https://ext.dcloud.net.cn/plugin?id=1643)

改造后的版本位于仓库 `uni-pushy-server/assets/utils/pushy/index.js`



**使用**

在 `app.vue` 中引入，在 `onLaunch` 生命周期接入，初始化成功就能检查更新了。

```vue
<!--
 * @name: 
 * @author: SunSeekerX
 * @Date: 2020-07-20 16:04:27
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-07-20 16:51:18
-->

<script>
// #ifdef APP-PLUS
import Pushy from '@/utils/pushy/pushy'
// #endif

export default {
  onLaunch: function() {
    console.log('App Launch')
    
    // #ifdef APP-PLUS
    const pushy = new Pushy({
      // 项目id
      projectId: '40bb2d3a-f815-4090-91f6-556b1806d52a',
      // 更新地址
      updateUrl: 'http://10.0.0.3:8081',
    })
    pushy.init()
    // #endif
  },

  onShow: function() {
    console.log('App Show')
  },

  onHide: function() {
    console.log('App Hide')
  },
}
</script>

```



初始化参数

|    key    |   说明   |  类型   | 默认 | 必须 |
| :-------: | :------: | :-----: | :--: | :--: |
| projectId |  项目id  | String  |  ''  | Yes  |
| updateUrl | 更新地址 | String  |  ''  | Yes  |
|  update   | 是否启用 | Boolean | true |  No  |



# 入门篇（Basics）

## 环境准备（Prerequisite）



## 安装（Installation）



## 设置（Configuration）

> [必备] [文件] 软件的设置



# 进阶篇（Advanced)

> [可选] [目录] 又称”开发篇“，提供中高级的开发教程

## Pm2 部署



## docker 部署

### 自行打包镜像

```bash
docker build -t uni-pushy:0.0.1-SNAPSHOT .
```



###  Docker hub镜像

`Docker hub` 镜像地址：[https://hub.docker.com/r/1647800606/uni-pushy/tags](https://hub.docker.com/r/1647800606/uni-pushy/tags)

**拉取镜像**

```bash
docker pull 1647800606/uni-pushy:latest
```



**启动镜像**

启动时需要映射外部环境变量文件至容器内部 `/app` 路径下，参考启动命令

```bash
docker run -d -p 8080:3000 -v /w/env/.env:/app/.env --name uni-pushy  1647800606/uni-pushy
```



# **API**（Reference）

> [可选] [目录|文件] 软件 API 的逐一介绍



# TODO

- 检查更新结果缓存
- 接口限流
- 文章：`Nodejs` `rsa` 加密的使用



# 更新日志（Changelog）

## 0.0.1 - 2020-08-24

- 【重要】移出上传文件到后端接口
- 【重要】增加 `Aliyun STS` 接口，用来生成临时访问的 `AccesId` 给前端直接上传文件到 `OSS` 



## 0.0.1 - 2020-08-19

- 增加资源排序



## 0.0.1 - 2020-08-18

- 【重要】增加 `Api sign` 接口加密



## 0.0.1 - 2020-08-15

### 功能（Features）

- 【重要】修改检查更新为查询资源方式，具体是否更新放在用户端进行判断
- 增加资源更新日志



##  0.0.1 - 2020-08-10

### Bug 修复 （Bug Fixes）

- 【重要】修复项目无资源检查更新出错

### 功能（Features）

- 【重要】检查更新新增原生资源校验

- 【重要】项目：新增 `appid` 唯一属性，原来为 `name（项目名）` 为唯一属性 

- 【重要】资源：增加了 `wgt` 资源原生版本依赖
- 【重要】资源：确定 `versionCode` 为更新唯一指标
- 【重要】资源：去除 `isFullUpdated` 字段，默认 `wgt` 资源为部分更新，`android`，`ios` 为整包更新
- 【重要】去除数据库`外键约束`， 改为应用层实现外键约束。（提高性能和扩展性）

- 【重要】增加登录注册 `md5` 加密

- 【重要】取消使用 `helmet` 模块，等待后期测试通过再加入
- 代码逻辑优化



# FAQ

## 这是什么？

一个uni－app 热更新的管理后台



## 有什么用？

可以用来管理 `uni-app` 热更新的资源和版本。



## 什么是热更新？

装在手机上的 app，不让用户知道就可以增加删除某些功能。快速修复 bug，快速更新功能。



## 有哪些技术用到了热更新？

`React native` ，`flutter `，`uni-app`



## 为什么要做这个？

网上又没有，不只能自己做。



## 后端用的是什么语言框架？

`Nestjs`



## 为什么用Nestjs ？

其他的我也不会。



## 为什么要用 antd-vue？

至少它一直在更新，你来维护 `element-ui` 吗？



## 为什么有个数据字典模块？

想做一套完整的后台解决方案。



## TS怎么样？

有一次写 `vue` 尝试了下 `ts`，感觉像 "si" 一样。写 `ts` 还要多些那么多代码，为什么还要确定数据类型，有什么 `interface` ，`type`。

 无意中看到了 `nestjs `，写多了 `ts ` 感觉 `js` 像 "si" 一样。



## Nestjs 好用吗？

`Node` 后端要是火起来，`nestjs` 应该是碾压 `express`，`koa2`，`egg.js`。。。



## 为什么要用你写的？

你不想看看我是怎么实现的吗？



## 会持续更新吗？

不会



## 确实学到了一些东西怎么感谢你？

啊这~，你给我点一个 ⭐ 嘛～



## 有问题可以问你吗？

你要是知道你的问题是什么，可以来问我。



## 怎么联系你。

能找到这个项目找不到我的联系方式？

