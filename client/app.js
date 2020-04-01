//app.js

var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')
import wxValidate from 'utils/WxValidate.js'

App({
  wxValidate: (rules, messages) => new wxValidate(rules, messages),
  serverUrl: "http://192.168.1.107:5000/",
  domain: "http://192.168.1.107:5000",
  globalData: {
    userInfo: null,
    openid:'',
    unionid:'',
    studentInfo: null,
    teacherInfo: null
  },
  onLaunch: function() {

  }
  ,
  teacherId: "",
  studentId: "",
  role:'',
  name:'',
  roleName:'',
  teacherNumber:'',
  studentNumber:'',
  parentName :'',
  relationship: '',
  parentMobile: '',
  masterId:8,
  session_key:''
  
})