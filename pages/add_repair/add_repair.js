// pages/add_repair/add_repair.js
var app = getApp();
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
const {
  $Toast
} = require('../../iView/dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    setInter: '',
    num: 1,
    hideAlert: true,
    uVideohide: false,
    uVideoHideView: false,
    startRecord: true,
    recording: false,
    reRecord: false,
    loading: false,
    disabled: false,
    isNewAudio: true,
    typeName: "总务处",
    buttonText: "暂无录音",
    types: [{
      "id": "1",
      "name": "总务处"
    }, {
      "id": "2",
      "name": "电教处"
    }],
    imgUrls: [],
    imageUrl: '',
    src: [],
    content: "",
    imgUrls: [],
    thumbnailsImgs: [],
    videoUrlShow: "",
    videoUrl: "",
    type: "",
    message: '',
    applicantName: "",
    address: "",
    radioUrl: "",
    description: "",
    remarks: "",
    mobile: "",
    typeId: "1"
  },

  getRemarks: function(e) {
    var val = e.detail.detail.value
    this.setData({
      remarks: val,
      hideAlert: true
    });
  },
  getMobile: function(e) {
    var val = e.detail.value
    this.setData({
      mobile: val,
      hideAlert: true

    });

  },
  getDescription: function(e) {
    var val = e.detail.value
    this.setData({
      description: val,
      hideAlert: true
    });

  },
  getApplicantName: function(e) {
    console.log(e)
    var val = e.detail.value
    this.setData({
      applicantName: val,
      hideAlert: true
    });

  },
  getAddress: function(e) {
    var val = e.detail.value
    console.log(val)
    this.setData({
      address: val,
      hideAlert: true

    });
  },
  handleClick: function(e) {
    if (this.data.applicantName == '') {
      this.setData({
        hideAlert: false,
        message: "请输入申请人姓名"
      })
      return
    }
    if (this.data.mobile == '') {
      this.setData({
        hideAlert: false,
        message: "请输入联系电话"
      })
      return
    }
    if (this.data.address == '') {
      this.setData({
        hideAlert: false,
        message: "输入故障地点"
      })
      return
    }
    if (this.data.description == '') {
      this.setData({
        hideAlert: false,
        message: "请输入问题描述"
      })
      return
    }
    var that = this;
    var imgUrlsArr = that.data.imgUrls;
    var imgUrls = "";
    //     'content': 
    for (var i = 0; i < imgUrlsArr.length; i++) {
      imgUrls += "," + imgUrlsArr[i];
    }
    if (imgUrls != '') {
      imgUrls = imgUrls.substr(1)
      that.setData({
        imageUrl: imgUrls
      })
    }

    var times = 0
    that.setData({
      disabled: true
    })
    setInterval(function() {
      times++
      if (times >= 3) {
        that.setData({
          disabled: false
        })
        clearInterval(i)
      }
    }, 1000)
    if (this.tempFilePath && this.data.isNewAudio) {
      //存在音频，上传音频获取到音频地址后提交数据
      console.log(" 执行  uploadsumit")
      that.upload()
    } else {
      console.log(" 执行  submitData")
      //不存音频直接提交数据
      that.submitData()
    }

  },
  submitData: function(e) {
    let that = this
    console.log(that.data.radioUrl)
    wx.request({
      url: app.serverUrl + 'api/v1/repair/add',
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },    
      data: {
        "address": that.data.address,
        "description": that.data.description,
        "applicantName": that.data.applicantName,
        "remarks": that.data.remarks,
        "mobile": that.data.mobile,
        "type": that.data.typeId,
        "imageUrl": that.data.imageUrl,
        "openid": app.globalData.openid,
        "radioUrl": that.data.radioUrl
      },
      success: function(res) {
        console.log(res.data)
        wx.hideLoading()
        if (res.data.status == 200) {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 2000
          })
          innerAudioContext.src = ""
          that.setData({
            imgUrls: [],
            imageUrl: '',
            src: [],
            content: "",
            imgUrls: [],
            thumbnailsImgs: [],
            videoUrlShow: "",
            videoUrl: "",
            type: "",
            message: '',
            applicantName: "",
            address: "",
            radioUrl: "",
            description: "",
            remarks: "",
            mobile: "",
            typeId: "1",
            tempFilePath: "",
            isNewAudio: false
          })
          wx.setStorage({
            key: "refreshRepair",
            data: "1"
          });
        } else {
          $Toast({
            content: '保存失败',
            type: 'error'
          });
        }

      },
      error: function() {
        wx.hideLoading()

        $Toast({
          content: '保存失败',
          type: 'error'
        });
      }
    })


  },
  bindTypePickerChange: function(e) {
    this.setData({
      typeName: this.data.types[e.detail.value].name,
      typeId: this.data.types[e.detail.value].id,
      hideAlert: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.audioCtx = wx.createAudioContext('myAudio')
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
    var that = this;
    //清除计时器  即清除setInter
    clearInterval(that.data.setInter)
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
  audioPlay() {
    this.audioCtx.play()
  },
  audioPause() {
    this.audioCtx.pause()
  },
  audio14() {
    this.audioCtx.seek(14)
  },
  audioStart() {
    this.audioCtx.seek(0)
  },
  addImage: function() {
    var that = this;
    that.setData({
      isuploaderror: 0
    });
    var nowLen = that.data.src.length;
    var remain = 9 - nowLen;
    wx.chooseImage({
      count: remain,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        var successUp = 0; //成功个数
        var failUp = 0; //失败个数
        var i = 0; //第几个
        var length = res.tempFilePaths.length;
        that.uploadDIY(res.tempFilePaths, successUp, failUp, i, length);
      }
    });
  },
  /* 函数描述：作为上传文件时递归上传的函数体体；
   * 参数描述： 
   * filePaths是文件路径数组
   * successUp是成功上传的个数
   * failUp是上传失败的个数
   * i是文件路径数组的指标
   * length是文件路径数组的长度
   */
  uploadDIY(filePaths, successUp, failUp, i, length) {
    var that = this;
    wx.showToast({
      title: '上传中...',
      icon: 'loading',
      duration: 2000000
    })
    wx.uploadFile({
      url: app.serverUrl + 'api/v1/upload',
      filePath: filePaths[i],
      name: 'file',
      formData: {
        'user': 'test'
      },
      success: (res) => {
        successUp++;
        var srcArr = that.data.src;
        srcArr.push(filePaths[i]),
          that.setData({
            src: srcArr
          });
        var data = JSON.parse(res.data);
        console.log(res.data);
        var newpicKeys = that.data.imgUrls;
        newpicKeys.push(data.url);
        that.setData({
          imgUrls: newpicKeys
        });

        var newpicKeysT = that.data.thumbnailsImgs;
        newpicKeysT.push(data.thumbnails);
        that.setData({
          thumbnailsImgs: newpicKeysT
        });

      },
      fail: (res) => {
        that.setData({
          isuploaderror: 1
        });
        failUp++;
      },
      complete: () => {
        i++;
        if (i == length) {
          wx.hideToast();
          var txt = '总共' + successUp + '张上传成功,' + failUp + '张上传失败！';
          wx.showToast({
            title: '上传成功',
            icon: 'success',
            duration: 1000
          })
          // app.toastShow(0, txt, 2000, 1);
          // wx.hideLoading();

        } else { //递归调用uploadDIY函数
          if (that.data.isuploaderror) {
            // app.toastShow(0, '图片上传失败，请重新选择上传', 2000, 1);
            wx.showToast({
              title: '上传失败，请重新选择上传',
              icon: 'success',
              duration: 1000
            })
          } else {
            this.uploadDIY(filePaths, successUp, failUp, i, length);
          }
        }
      }
    });
  },
  deleteImage: function(e) {
    console.log(e);
    let index = e.currentTarget.dataset.index;
    console.log(index);
    var srcArr = this.data.src;
    srcArr.splice(index, 1);
    this.setData({
      src: srcArr
    })
  },
  //开始录音的时候
  start: function() {
    const options = {
      duration: 90000, //指定录音的时长，单位 ms
      sampleRate: 16000, //采样率
      numberOfChannels: 1, //录音通道数
      encodeBitRate: 96000, //编码码率
      format: 'mp3', //音频格式，有效值 aac/mp3
      frameSize: 50, //指定帧大小，单位 KB
    }
    //开始录音
    recorderManager.start(options);
    recorderManager.onStart(() => {
      console.log('recorder start')
      //清除计时器  即清除setInter
      clearInterval(this.data.setInter)
      this.startSetInter()
      this.setData({
        startRecord: false,
        recording: true,
        reRecord: false,
        isNewAudio: true
      })
    });
    //错误回调
    recorderManager.onError((res) => {
      console.log(res);
    })
  },
  //停止录音
  stop: function() {
    recorderManager.stop();
    recorderManager.onStop((res) => {
      this.tempFilePath = res.tempFilePath;
      console.log('停止录音', res.tempFilePath)
      clearInterval(this.data.setInter)
      this.setData({
        startRecord: false,
        recording: false,
        reRecord: true,
        num: 1,
        buttonText:'播放录音'
      })
      const {
        tempFilePath
      } = res
    })
  },
  //播放声音
  play: function() {
    innerAudioContext.play()
    innerAudioContext.src = this.tempFilePath,
      innerAudioContext.onPlay(() => {
        console.log('开始播放')
        this.setData({
          buttonText: '播放中...'
        })
      })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },
  startSetInter: function() {
    var that = this;
    //将计时器赋值给setInter
    that.data.setInter = setInterval(
      function() {
        var numVal = that.data.num + 1;
        that.setData({
          num: numVal
        });
        console.log('setInterval==' + that.data.num);
      }, 1000);
  },
  endSetInter: function() {
    var that = this;
  },
  //上传录音
  upload: function() {
    let that = this
    wx.uploadFile({
      url: app.serverUrl + "api/v1/upload", //演示域名、自行配置
      filePath: this.tempFilePath,
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data"
      },
      formData: {
      },
      success: function(res) {
        var data = JSON.parse(res.data);
        wx.hideLoading()
        console.log(data.url);
        that.setData({
          radioUrl: data.url
        })
        that.submitData()

      },
      fail: function(res) {
        wx.hideLoading()

        console.log(res);
      },
      complete: function(res) {
        wx.hideLoading()

      }
    })
  }
})