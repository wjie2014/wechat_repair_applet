
### 后台源码索要请关注微信公众号JeenWang，回复索要源码+邮箱 ，谢谢！


> 使用 flask + mysql + 微信小程序开发的校园微信报修小程序，简单易懂。

### 为什么会产生这样一个系统 ？
最近收到不少博友的消息 ，对微信小程序开发整体流程不是很了解 ， 希望得到我的帮助 ， 因之前版本的微信小程序，后端均由 Java 完成 ， 基础不好的朋友一时难以看懂 ，所有我选择了一个非常容易上手的框架 flask 结合微信小程序原生开发完成整个系统 。 

### 我为什么选择 flask 做为后端框架 ？
flask 具有轻巧、简介、扩展性强等特点 ， 非常适合小型系统开发 ， 具有一定的编程基础即可快速上手 ， 本文中 flask 搭建的后台管理和 api 系统是我零基础 flask ，但仅花两天的时间编写的 ，感受是非常简单 。因为我一直是做 Java 开发的 ， 这次使用 flask 做小系统非常快 ， 推荐给基础薄弱的朋友和想快速开发小型系统的朋友使用 flask 。 

### 系统包含哪些主要知识点 ？
| 微信小程序 | flask|
|-----|-----|
| 授权登录 | 用户登录、获取微信用户信息   | 
| 下拉刷新 | 用户管理（增删改查）   | 
| 加载更多 | 报修管理、图片保存   | 
| 页面编写 | 请求网络接口、对外提供 api   | 
| 表单操作 | 操作 mysql 数据库，使用 redis 缓存  | 
| 图片上传 | session 登录验证   | 
| 接口调用 | layui 编写后台页面   | 

### 数据库表设计（字段长度根据实际情况调整为合适长度即可）
报修信息表 

```
CREATE TABLE `repair_service_sheet`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `teacherId` int(11) NULL DEFAULT NULL COMMENT '报修人id',
  `type` tinyint(11) NULL DEFAULT NULL COMMENT '报修类型',
  `status` tinyint(11) NULL DEFAULT NULL COMMENT '报修单状态',
  `repairDate` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '报修时间',
  `address` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '报修地址',
  `description` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '故障描述',
  `imageUrl` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '故障图片',
  `message` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '留言',
  `evaluate` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '意见和建议',
  `reason` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '故障原因',
  `consumables` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '故障耗材',
  `applicantName` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '申请人姓名',
  `remarks` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '备注',
  `mobile` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '申请人联系电话',
  `star` tinyint(4) NULL DEFAULT NULL COMMENT '几颗星',
  `radioUrl` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '语音url',
  `evaluateDate` datetime(0) NULL DEFAULT NULL COMMENT '评价时间',
  `openid` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `campus` int(11) NULL DEFAULT 1 COMMENT '学校',
  `finishTime` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '维修完成时间',
  `allocatedTime` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '任务分配时间',
  `detail` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '故障处理说明',
  `repairCancelReason` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '报修取消原因',
  `repairCancelReasonRemark` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '报修取消原因备注',
  `repairCancelDate` datetime(0) NULL DEFAULT NULL COMMENT '报修取消时间',
  `location` tinyint(4) NULL DEFAULT NULL COMMENT '位置名称',
  `guarantee` tinyint(4) NULL DEFAULT NULL COMMENT '是否在保修期 1、处于保修期 2、未在保修期',
  `fundingSources` tinyint(4) NULL DEFAULT NULL COMMENT '经费来源',
  `level` tinyint(4) NULL DEFAULT 3,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 602 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;
```

用户信息表

```
CREATE TABLE `ideamerry_repair_v3`.`Untitled`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userName` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `userType` int(11) NULL DEFAULT NULL,
  `userPassword` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `mobile` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `openId` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `nickName` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `avatarUrl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sex` int(11) NULL DEFAULT NULL,
  `province` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `city` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `tags` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `avialable` int(11) NULL DEFAULT NULL,
  `updateTime` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `createTime` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `gender` int(11) NULL DEFAULT NULL,
  `language` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `isDelete` int(11) NOT NULL DEFAULT 0,
  `campus` int(11) NULL DEFAULT NULL COMMENT '管理员的校区',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `use_name`(`userName`) USING BTREE COMMENT '唯一'
) ENGINE = InnoDB AUTO_INCREMENT = 36 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;
```

### flask + layui 实现的页面是什么样 ？
![在这里插入图片描述](https://images.gitee.com/uploads/images/2020/0323/131150_1fd82824_1188022.png)
![在这里插入图片描述](https://images.gitee.com/uploads/images/2020/0323/131150_d440b6d5_1188022.png)
![在这里插入图片描述](https://images.gitee.com/uploads/images/2020/0323/131149_14042410_1188022.png)
### 微信小程序端页面是什么样 ？
![在这里插入图片描述](https://images.gitee.com/uploads/images/2020/0323/131149_ef3b762f_1188022.png)
![在这里插入图片描述](https://images.gitee.com/uploads/images/2020/0323/131149_924383c1_1188022.png)
![在这里插入图片描述](https://images.gitee.com/uploads/images/2020/0323/131149_a5ba9194_1188022.png)
![在这里插入图片描述](https://images.gitee.com/uploads/images/2020/0323/131150_7df85494_1188022.png)
![在这里插入图片描述](https://images.gitee.com/uploads/images/2020/0323/131150_101ffc40_1188022.png)
### 结束语
学习需要方法 ， 知识重在积累 。没有做不到 ， 只有想不到 。

