// pages/userAuth/index.js
var app = getApp();
const {
  $Toast
} = require('../../iView/dist/base/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    relationship: '',
    studentView: true,
    teacherView: false,
    studentPosition: "activeTab",
    teacherPosition: "",
    types: [{
      "name": "父亲"
    }, {
      "name": "母亲"
    }, {
      "name": "其他亲属"
    }],
    teacherName: '',
    teacherNumber: '',
    teacherPassword: '',
    studentName: '',
    studentPassword: '',
    studentNumber: '',
    parentName: '',
    mobile: '',
    name: '',
    unionid:'',
    openid:'',
    id:''

  },
  studentNameInput: function(e) {
    this.setData({
      studentName: e.detail.detail.value
    })
  },
  studentPasswordInput: function(e) {
    this.setData({
      studentPassword: e.detail.detail.value
    })
  },
  studentNumberInput: function(e) {
    this.setData({
      studentNumber: e.detail.detail.value
    })
  },
  parentNameInput: function(e) {
    this.setData({
      parentName: e.detail.detail.value
    })
  },
  mobileInput: function(e) {
    console.log(e)

    this.setData({
      mobile: e.detail.detail.value
    })
  },
  relationshipInputChange: function(e) {
    console.log(e)
    this.setData({
      relationship: e.detail.detail.value
    })
  },

  teacherNameInput: function(e) {
    this.setData({
      teacherName: e.detail.detail.value
    })
  },
  teacherNumberInput: function(e) {
    this.setData({
      teacherNumber: e.detail.detail.value
    })
  },
  teacherPasswordInput: function(e) {
    console.log(e)
    this.setData({
      teacherPassword: e.detail.detail.value
    })
  },

  teacherHandleClick: function() {
    let that = this
    wx.request({
      url: app.serverUrl + 'api/auth/getTeacher',
      data: {
        name: that.data.teacherName,
        uId:that.data.id,
        password: that.data.teacherPassword,
        teacherNumber: that.data.teacherNumber,
        openId: that.data.openid,
        unionId: that.data.unionid      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        if (res.data.code == 200) {
          wx.setStorage({
            key: "refreshMe",
            data: "1"
          });
          wx.setStorage({
            key: "refreshHome",
            data: "1"
          });
          //更新全局用户信息
          app.teacherId = res.data.obj
          app.role = '1'
          app.name = that.data.teacherName
          //更新全局教师信息
          that.getAuthInfo()
          $Toast({
            content: res.data.msg,
            type: 'success'
          });
        } else {
          $Toast({
            content: res.data.msg,
            type: 'error'
          });
        }
      }
    })
  },
  studentHandleClick: function() {
    let that = this
    wx.request({
      url: app.serverUrl + 'api/auth/getStudent',
      data: {
        name: that.data.studentName,
        studentPassword: that.data.studentPassword,
        studentNumber: that.data.studentNumber,
        openId: that.data.openid,
        uId: that.data.id,
        unionId: that.data.unionid,
        parentName: that.data.parentName,
        mobile: that.data.mobile,
        relationship: that.data.relationship
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        if (res.data.code == 200) {
          wx.setStorage({
            key: "refreshMe",
            data: "1"
          });
          wx.setStorage({
            key: "refreshHome",
            data: "1"
          });
          console.log(that.data)
          //更新全局用户信息
          app.studentId = res.data.obj
          app.role = '2'
          app.name = that.data.studentName
          //更新全局学生信息
          that.getAuthInfo()
          $Toast({
            content: res.data.msg,
            type: 'success'
          });
        } else {
          $Toast({
            content: res.data.msg,
            type: 'error'
          });
        }
      }
    })
  },
  getAuthInfo: function() {
    let that = this
    wx.request({
      url: app.serverUrl + 'api/auth/getTeacherIdByOpenId',
      data: {
        openId: that.data.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log(res.data)
        app.role = res.data.type
        if (app.role == 1) {
          app.teacherId = res.data.uId
          that.getTeacherById()
        } else {
          app.studentId = res.data.uid
          app.relationship = res.data.relationship
          that.getStudentById()
        }
      }
    })
  },
  getTeacherById: function() {
    let that = this
    wx.request({
      url: app.serverUrl + 'api/auth/getTeacherById/' + app.teacherId,
      data: {
        openId: that.data.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log(res.data)
        app.globalData.teacherInfo = res.data
      }
    })
  },
  getStudentById: function() {
    let that = this
    wx.request({
      url: app.serverUrl + 'api/auth/getStudentById/' + app.studentId,
      data: {
        openId: that.data.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log(res.data)
        app.globalData.studentInfo = res.data
      }
    })
  },
  changeStudent: function() {
    this.setData({
      studentPosition: "activeTab",
      teacherPosition: "",
      studentView: true,
      teacherView: false
    })
  },
  changeTeacher: function() {
    this.setData({
      studentPosition: "",
      teacherPosition: "activeTab",
      studentView: false,
      teacherView: true
    })
  },

  handleChange({
    detail
  }) {
    this.setData({
      current: detail.key
    });
  },

  bindTypesPickerChange: function() {

  },

  handleChangeScroll({
    detail
  }) {
    this.setData({
      current_scroll: detail.key
    });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      openid:options.openid,
      unionid: options.unionid
    })
    if (app.role == 1) {
      this.setData({
        studentPosition: "",
        teacherPosition: "activeTab",
        studentView: false,
        teacherView: true
      })
      this.setData({
        teacherName: app.globalData.teacherInfo.name,
        teacherNumber: app.globalData.teacherInfo.teacherNumber
      })
    } else {
      if (app.globalData.studentInfo) {
        this.setData({
          studentName: app.globalData.studentInfo.name,
          studentNumber: app.globalData.studentInfo.studentNumber,
          parentName: app.parentName,
          mobile: app.parentMobile,
          relationship: app.relationship
        })
      }

    }
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

  },
  studentClick: function() {
    wx.navigateTo({
      url: '../studentBinding/index',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  teacherClick: function() {
    wx.navigateTo({
      url: '../teacherBinding/index',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})