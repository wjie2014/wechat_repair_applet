// pages/repairDetail/index.js
var app = getApp();
const innerAudioContext = wx.createInnerAudioContext()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.domain,
    repair: {},
    starIndex1: 0,
    evaluate: '',
    imageArr: [],
    hideEvaluate:false,
    users: [],
    default: '/pages/images/audio.jpg',
    buttonText: '播放录音',
    userInfo: {},
    openid: '',
    userid: '',
    nickName: '',
    mobile: '',
    startRepairShow: true,
    finishRepairShow:true
  },
  imageShow: function(e) {
    var index = e.target.dataset.id;
    var imgArr = this.data.imageArr;
    var tempImgArr = [];
    for (var i = 0; i < imgArr.length; i++) {
      var urlPrex = imgArr[i];
      tempImgArr.push(app.domain + urlPrex);
    }
    console.log(tempImgArr);
    wx.previewImage({
      current: tempImgArr[index], //当前图片地址
      urls: tempImgArr, //所有要预览的图片的地址集合 数组形式
      success: function(res) {

      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  getEvaluate: function(e) {
    console.log(e)
    var evaluate = e.detail.detail.value
    this.setData({
      evaluate: evaluate
    })
  },
  onChange1(e) {
    const index = e.detail.index;
    this.setData({
      'starIndex1': index
    })
  },
  
  bindTypePickerChange: function(e) {
    this.setData({
      nickName: this.data.users[e.detail.value].nickName,
      openid: this.data.users[e.detail.value].openid,
      userid: this.data.users[e.detail.value].id,
      mobile: this.data.users[e.detail.value].mobile

    })
  },
  handleClick: function(e) {
    let that = this
   
    console.log(that.data.openid)
    console.log(that.data.userid)
    console.log(that.data.repair.id)
    if (that.data.userid==''){
      wx.showToast({
        title: '请选择维修员',
        icon: 'fail',
        duration: 2000
      })
      return
    }
    wx.request({
      url: app.serverUrl + 'api/repairServiceSheet/saveRepairUser',
      method: "POST",
      data: {
        "openid": that.data.openid,
        "userid": that.data.userid,
        "mobile": that.data.mobile,
        "nickName": that.data.nickName,
        "repairid": that.data.repair.id
      },
      success: function(res) {
        
        console.log(res.data)
        if (res.data == 1) {
          wx.showToast({
            title: '分配任务成功',
            icon: 'success',
            duration: 2000
          })

          wx.setStorage({
            key: "refreshRepair",
            data: "1"
          });
        } else {
          wx.showToast({
            title: '分配任务失败',
            icon: 'fail',
            duration: 2000
          })
        }

      },
      error: function() {
        
        $Toast({
          content: '保存失败',
          type: 'error'
        });
      }
    })
  },
  updateRepairStatus: function(e) {
    var status = e.target.dataset.status
    var that = this
   
    console.log(that.data.openid)
    console.log(that.data.userid)
    console.log(that.data.repair.id)
    wx.request({
      url: app.serverUrl + 'api/repairServiceSheet/update',
      method: "POST",
      data: {
        "status": status,
        "id": that.data.repair.id
      },
      success: function(res) {
        
        console.log(res.data)
        if (res.data == 1) {
          if (status == 3) {
            that.setData({
              startRepairShow: false
            })
          } else
          if (status == 4) {
            that.setData({
              startRepairShow: false,
              finishRepairShow: false
            })
          }
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 2000
          })
          wx.setStorage({
            key: "refreshRepair",
            data: "1"
          });
        } else {
          wx.showToast({
            title: '提交失败，请重试！',
            icon: 'fail',
            duration: 2000
          })
        }

      },
      error: function() {
        
        wx.showToast({
          title: '提交失败，请重试！',
          icon: 'fail',
          duration: 2000
        })
      }
    })
  },
  evaluateClick: function (e) {
    
    wx.request({
      url: app.serverUrl + 'api/repairServiceSheet/update',
      method: "POST",
      data: {
        "evaluate": that.data.evaluate,
        "star":that.data.starIndex1,
        "id": that.data.repair.id
      },
      success: function (res) {
        console.log(res.data)
      
        if (res.data == 1) {
          that.setData({
            hideEvaluate:true
          })
          wx.showToast({
            title: '评价成功',
            icon: 'success',
            duration: 2000
          })
          wx.setStorage({
            key: "refreshRepair",
            data: "1"
          });
        } else {
          wx.showToast({
            title: '评价失败，请重试！',
            icon: 'fail',
            duration: 2000
          })
        }

      },
      error: function () {
        wx.showToast({
          title: '评价失败，请重试！',
          icon: 'fail',
          duration: 2000
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var repair = JSON.parse(options.repair);
    console.log(repair)
    if (options.repair == null) {
      wx.showToast({
        title: '数据异常',
      })
      return;
    }
    if (repair.imageUrl != '' && repair.imageUrl != null) {
      var arr = repair.imageUrl.split(",")
      this.setData({
        imageArr: arr
      })
      console.log(arr)
    }
    this.setData({
      repair: repair,
      userInfo: app.globalData.userInfo
    })
    console.log(this.data.url + repair.radioUrl)
    innerAudioContext.src = this.data.url + repair.radioUrl

    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },
  //点击播放, (如果要一进来就播放放到onload即可)
  play: function() {
    innerAudioContext.play();
    this.setData({
      buttonText: '正在播放...'
    })
  },
  //点击 停止
  stop: function() {
    innerAudioContext.pause();
    this.setData({
      buttonText: '重新播放'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    innerAudioContext.onEnded((res) => {
      this.setData({
        buttonText: '重新播放'
      })
    })
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
    innerAudioContext.destroy()
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