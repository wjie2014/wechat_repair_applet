// pages/repair/repair.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    repairList: [],
    page: 1,
    pageSize: 10,
    current: 0,
    status: ''
  },

  getrepairList: function (e) {
    let that = this
    wx.request({
      url: app.serverUrl + 'api/repairServiceSheet/listAdmin/' + that.data.page + "/" + that.data.pageSize + "/" + that.data.status,
      data: {
        page: that.data.page,
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
        if (res.data.hasNextPage == true) {
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
    var status = options.status
    console.log(status)
    if (status == 1) {
      wx.setNavigationBarTitle({
        title: '待分配工单',
      })
    } else if (status == 2) {
      wx.setNavigationBarTitle({
        title: '已分配工单',
      })
    } else if (status == 4) {
      wx.setNavigationBarTitle({
        title: '已完成工单',
      })
    }
    this.setData({
      status: status
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
    var that = this;
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
    console.log("下拉刷新")
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
      url: '../addRepair/addRepair',
    })
  },
  goDetail: function (e) {
    var repair = JSON.stringify(e.currentTarget.dataset.repair);
    wx.navigateTo({
      url: '../repairDetail/index?repair=' + repair,
    })
  }
})