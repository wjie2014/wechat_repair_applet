// pages/repair/repair.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     repairList:[],
     page:1,
     pageSize:10,
     current:0
  },

  getrepairList:function(e){
    let that = this
    wx.request({
      url: app.serverUrl + 'api/v1/repair/list/' + that.data.page + "/" + that.data.pageSize,
      data: {
        openid: app.globalData.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        if (that.data.page == 1) {
          that.setData({
            repairList: [],
          })
        }
        var repairList = that.data.repairList
        for (var i = 0; i < res.data.list.length; i++) {
          repairList.push(res.data.list[i])
        }
        that.setData({
          repairList: repairList
        });
        if (res.data.list.length >=that.data.pageSize) {
          that.data.page++;
          that.setData({
            hasNextPage: true,
            loadMoreText: "加载中..."
          })
        } else {
          that.setData({
            hasNextPage: false,
            loadMoreText: "我是有底线的"
          })
        }
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '报修',
    })
    this.getrepairList()
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
    var that = this
    //判断用户是否绑定，若未绑定则自动跳转到用户身份认证页面，若已经绑定，则可以使用所有功能

    var userInfo = app.globalData.userInfo 
    if(userInfo&&userInfo.isBindingMobile==1){
      console.log("已经身份认证，可以正常使用")
    }else{
      console.log("跳转到身份认证页面进行认证")
      wx.navigateTo({
        url: '/pages/binding/index',
      })
    }

    wx.getStorage({
      key: 'refreshRepair',
      success: function (res) {
        console.log(res.data);
        var data = res.data;
        if (data) {
          if (data == 1) {
            wx.setStorage({
              key: "refreshRepair",
              data: "0",
              page: 1
            });
            that.onPullDownRefresh();
          }
        }
      }
    })
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
    this.setData({
      page: 1
    })
    this.getrepairList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasNextPage == true) {
      this.getrepairList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
   handleChange: function (e) {
    wx.navigateTo({
      url: '../add_repair/add_repair',
    })
  },
  goDetail:function(e){
    var repair = JSON.stringify(e.currentTarget.dataset.repair);
    wx.navigateTo({
      url: '../repair_detail/index?repair=' + repair,
    })
  }
})