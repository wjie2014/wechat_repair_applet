// pages/bingding/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: '',
    openid: '',
    nikeName: '',
    buttonText:'完成认证'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let openid = options.openid;
    console.log(openid)
    this.setData({
      openid: openid
    });
    this.getUser()
  },
  //获取用户输入的用户名
  mobileInput: function(e) {
    this.setData({
      mobile: e.detail.detail.value
    })
  },
  //获取用户输入的用户名
  nikeNameInput: function(e) {
    console.log(e)
    this.setData({
      nikeName: e.detail.detail.value
    })
  },
  getUser: function(e) {
    let that = this
    wx.request({
      url: app.serverUrl + 'api/auth/getUserInfo',
      data: {
        'openid': app.globalData.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log(res.data)
        that.setData({
          mobile: res.data.mobile,
          nikeName: res.data.nickName,
        })

        if(res.data.mobile!=''){
          that.setData({
          buttonText: '重新认证'
          })
        }
        //设置刷新我的页面
        wx.setStorage({
          key: "refreshMe",
          data: "1"
        });
      }
    })
  },
  submit: function(e) {
    let that = this
    console.log(this.data.mobile)
    console.log(this.data.nikeName)
    console.log(this.data.openid)
    wx.request({
      url: app.serverUrl + 'api/auth/updateUserInfo',
      data: {
        'mobile': that.data.mobile,
        'nikeName': that.data.nikeName,
        'openid': app.globalData.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log(res.data)
        wx.showToast({
          title: '认证成功',
          icon: 'success',
          duration: 3000
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})