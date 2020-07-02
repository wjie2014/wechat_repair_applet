// pages/binding/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: '',
    openid: '',
    realName: '',
    buttonText: '完成认证'
  },

  /**
   * 监听真实姓名的输入
   */
  inputRealName: function (e) {
    var realName = e.detail.value
    this.setData({
      realName: realName
    })
  },

  /**
   * 监听手机号码的输入
   */
  inputMobile: function (e) {
    var mobile = e.detail.value
    this.setData({
      mobile: mobile
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
       //获取用户信息，若存在则初始化填充页面中的姓名和手机号
       var userInfo = app.globalData.userInfo 
       console.log(userInfo)
       if(userInfo){
         this.setData({
           mobile:userInfo.mobile,
           realName:userInfo.realName
         })
       }
  },

  /**
   * 提交绑定信息到后台api接口
   */
  bindingAdd: function () {
    var that = this
    //调用后台接口，提交用户id、真实姓名、手机号 
    wx.request({
      url: app.serverUrl + "api/v1/user/binding",
      method: "POST",
      data: {
        mobile: that.data.mobile,
        realName: that.data.realName,
        userId: app.globalData.userInfo.id //传递用户id、根据id去绑定真实姓名和手机号
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data)
        //若 res.data.status==200 表示保存成功、更新 app.globalData.userInfo 的信息供其他页面使用
        if(res.data.status==200){
          app.globalData.userInfo.mobile=that.data.mobile
          app.globalData.userInfo.realName=that.data.realName
          app.globalData.userInfo.isBindingMobile=1
          wx.showModal({
            title:'友情提醒',
            content:'身份认证成功，快去体验报修吧!',
            confirmText: '去报修',
            success:function(res){
              if(res.confirm){
                  wx.switchTab({
                    url: '/pages/repair/repair',
                  })
              }
            }
          })
        }else{
          wx.showToast({
            title: '绑定失败，请重试！',
            icon:'none'
          })
        }
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
})