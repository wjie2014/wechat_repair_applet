var app = getApp();
const {
  $Toast
} = require('../../iView/dist/base/index');
Page({
  data: {
    url: app.domain,
  },
  onShow: function () {
  },
  onLoad: function () {
    this.login()
  },
  login:function(){
    wx.login({
      success: function (res) {
        console.log(res);
        if (res.code) {
          wx.request({
            url: app.serverUrl + 'api/v1/wx/login',
            data: {
              code: res.code
            },
            success: function (res) {
              app.globalData.openid = res.data.openid
              if(typeof(res.data.id)=='undefined'){
                wx.showModal({
                  title: '警告',
                  content: '尚未进行授权，请点击确定跳转到授权页面进行授权。',
                  success: function (res) {
                    if (res.confirm) {
                      console.log('用户点击确定');
                      wx.navigateTo({
                        url: '../auth/auth',
                      })
                    }
                  }
                });
              }
              app.globalData.userInfo=res.data
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
  }
})