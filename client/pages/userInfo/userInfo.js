// pages/userInfo/userInfo.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
     email:"",
     mobile:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: '个人信息' });
    var that = this;
    wx.request({
      url: app.serverUrl + 'wx/login/getUserInfo', //仅为示例，并非真实的接口地址
      data: {
        openid: app.globalData.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          email: res.data.email,
          mobile:res.data.mobile
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
  , submit: function (e) {
 
    wx.request({
      url: app.serverUrl + 'wx/login/updateUserInfo', //仅为示例，并非真实的接口地址
      data: {
        email: e.detail.value.email,
        mobile: e.detail.value.mobile,
        openid: app.globalData.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        wx.showToast({
          title: res.data.msg,
          icon: 'success',
          duration: 3000
        })
      }
    })
  }
})