var app = getApp();
const {
  $Toast
} = require('../../iView/dist/base/index');
//引用外部文件（需要暴露util.js里面的formatNumber()函数）
var TimeUtil = require('../../utils/util.js');
Page({
  data: {
    url: app.domain,
  },
  onShow: function() {
    var that = this;
  },
  onLoad: function() {
    var that = this;
    wx.setNavigationBarTitle({
      title: '首页',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
    wx.login({
      success: function(res) {
        console.log(res);
        if (res.code) {
          wx.request({
            url: app.serverUrl + 'api/v1/wx/login',
            data: {
              code: res.code
            },
            success: function(res) {
              app.globalData.openid = res.data.openid
              wx.request({
                url: app.serverUrl + 'api/v1/wx/getUserInfoByOpenid',
                data: {
                  openid: app.globalData.openid
                },
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success: function(res) {
                  console.log(res.data)
                  if(res.data.code==500){
                    wx.showModal({
                      title: '警告',
                      content: '尚未进行授权，请点击确定跳转到授权页面进行授权。',
                      success: function(res) {
                        if (res.confirm) {
                          console.log('用户点击确定');
                          wx.navigateTo({
                            url: '../auth/auth',
                          })
                        }
                      }
                    })
                  }else{
                    app.globalData.userInfo=res.data.obj
                  }
                }
              });
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
  },
})