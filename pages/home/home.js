var app = getApp();
const {
  $Toast
} = require('../../iView/dist/base/index');
Page({
  data: {
    url: app.domain,
    tabs: ['新报修', '维修中', '已完成'],
    current:0,
    repairList:[],
    page:1,
    pageSize:10
  },
  tabSelect:function(e){
    var current = e.currentTarget.dataset.id
    this.setData({
      current:current
    })
  },
  onShow: function () {

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
  onLoad: function () {
    this.login()
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
  login:function(){
    var that = this 
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.request({
            url: app.serverUrl + 'api/v1/wx/login',
            data: {
              code: res.code
            },
            success: function (res) {
              if(typeof(res.data.id)=='undefined'){
                wx.showModal({
                  title: '警告',
                  content: '尚未进行授权，请点击确定跳转到授权页面进行授权。',
                  success: function (res) {
                    if (res.confirm) {
                      wx.navigateTo({url: '../auth/auth',})
                    }
                  }
                });
              }
              app.globalData.openid = res.data.openid
              app.globalData.userInfo=res.data
              that.getrepairList()
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
  }
})