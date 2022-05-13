# 📌 更新日志（CHANGELOG）

**新版本模板**

```
### next（未发布分支）
**计划时间（Plan）**

- 开始时间 -

- 预计发布 -

**功能（Features）**

**Bug 修复 （Bug Fixes）**

**技术预研（Research）**
```

**用到的符号**

- ☑️ 开发完成
- ✅ 自测完成

### next（计划中的功能）

**功能（Features）**

- 个人信息修改
- 环境变量配置验证优化
- 支持使用内存作为缓存（单机可用，如果是多个server 实例需要使用 redis）
- 模块目录优化

**Bug 修复 （Bug Fixes）**

**技术预研（Research）**

### 0.3.0 - 2022-05-10

**功能（Features）**

1. 【重要】数据库结构需要相应的做一些修改，需要删除 `app_user` 表的 email 索引。索引名可能不一样。可以执行 `sql/upushy-2022-05-10` 做快捷修改。

   ```sql
   ALTER TABLE `app_user`
   DROP INDEX `IDX_3fa909d0e37c531ebc23770339`;
   ```

2. 【重要】注册用户可以不需要邮箱和昵称

3. 【重要】项目更名为 `upushy`

4. 升级到最新的依赖

### 0.2.0

**计划时间（Plan）**

- 开始时间 - 2021-09-13 23:38:49

- 预计发布 -

**功能（Features）**

1. 【重要】升级 nestjs 到 8
2. 【重要】移除 `nestjs-redis` 包，改为官方推荐方式实现 redis 访问
3. 【重要】拆分基础模块到 `/basic` 下，`uni-pushy-admin` 项目 api 路径有修改
4. 【重要】环境变量配置 `API_SIGN_RSA_PRIVATE_KEY` 变更为 `API_SIGN_RSA_PRIVATE_KEY_BASE64`
5. 【重要】移除默认 `API_SIGN_RSA_PRIVATE_KEY` 配置
6. 代码结构优化
7. 注释优化

**Bug 修复 （Bug Fixes）**

1. 修复项目列表分页数据不正确的问题

### 0.1.0

#### build 100 3a6924a

**计划时间（Plan）**

- 开始时间 - 2021-07-09

- 预计发布 -2021-07-13

**功能（Features）**

1. 【重要】环境变量改为 `yaml` 文件配置
2. 【重要】新增 `Docker` 部署
3. 移除一些默认不需要配置的环境变量

#### build 101 1329ab2

**计划时间（Plan）**

- 开始时间 -2021-07-13

- 预计发布 -2021-07-13

**Bug 修复 （Bug Fixes）**

1. 修复不填写 `ALIYUN_RAM_TEMPORARY_EXPIRE` 无法启动的问题
