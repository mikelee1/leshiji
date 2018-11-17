// pages/ask/ask.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputnum:0,
    files: ["../../images/pic_160.png"],
    gradearray: ['未选择', '二年级', '三年级', '四年级', '五年级', '六年级', '初一', '初二','初三','高一','高二','高三'],

    grade: '未选择',
    gradeindex: 0,
    easy: 'noeasy',
    rewardarray: ['未选择', '1个奥币','2个奥币','3个奥币'],
    rewardindex:0,
    reward:0,
    easyitems: [
      { name: 'difficult', value: '困难' },
      { name: 'easy', value: '简单', checked: 'true' },
    ],
    desc: '',
    placeholder:'',
    withimg: false,
    askpicdoor:false,
    avatar:app.globalData.avatar,
    screenwidth:app.globalData.screenwidth,
    screenheight: app.globalData.screenheight,
    imagelength:0,
    disabledbut:false,
    anonymous:'false',
    hideuploadimg:false,
    i:0,
    fnid:0,
  },


  rewardinput: function (e) {
    var that = this
    this.setData({
      reward: e.detail.value
    })
  },

  onChangeAnonymous:function(e){
    var that = this
    var res = (that.data.anonymous == 'true')?"false" : "true"
    that.setData({
      anonymous: res
    })
  },



  descinput: function (e) {
    var num = e.detail.value.length
    app.globalData.placeholder= e.detail.value
    this.setData({
      desc: e.detail.value,
      inputnum:num,
      
    })
  },
  radioChange: function (e) {
    this.setData({
      easy: e.detail.value
    })
  },


  bindPickerChange: function (e) {
    this.setData({
      gradeindex: e.detail.value,
      grade: this.data.gradearray[e.detail.value]
    })
  },


  bindPickerChangereward: function (e) {
    this.setData({
      rewardindex: e.detail.value,
      reward: this.data.rewardarray[e.detail.value]
    })
  },


  uploadimg: function () {
    var that = this;
    var a = that.data.files
    var picseatnum

    if (a[0] == "../../images/pic_160.png") {
      picseatnum = 9
    }else{
      picseatnum = 9-a.length
    }
    wx.chooseImage({
      count: picseatnum, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        console.log(res)
        
        console.log(a)
        const src = res.tempFilePaths
        
        console.log(src)
        var leng
        if (a[0] == "../../images/pic_160.png"){
          leng = res.tempFilePaths.length
          that.setData({
            files: src,
            imagelength: leng,
            withimg:true,
            // problempicsrc: src,
            // askpicdoor: true,
            // img: src
          })
        }else{
          console.log(a)
          leng = res.tempFilePaths.length + a.length
          var b = a.concat(src)
          that.setData({
            files: b,
            imagelength: leng,
            withimg: true,

            // problempicsrc: src,
            // askpicdoor: true,
            // img: src
          })
          console.log(b)
        }
        if (leng==9){
          that.setData({
            hideuploadimg:true
          })
        }

      }
    })
  },


  ask: function (data) {
    var i,fnid
    var that = this
    if (that.data.desc == '' && that.data.files[0] == "../../images/pic_160.png" ){
      wx.showModal({
        title: '提示',
        content: '至少输入一项',
      })
    }else{
      if (that.data.withimg) {
        i = data.i ? data.i : 0
        fnid = data.fnid ? data.fnid : 0
        console.log("i and fnid:",i, fnid)
        var data = { 'openid': app.globalData.openid, 'longitude': app.globalData.userlongitude, 'latitude': app.globalData.userlatitude, 'desc': that.data.desc, 'anonymous': that.data.anonymous, 'index': i, 'length':that.data.files.length, 'fnid':fnid}
        wx.uploadFile({
          url: app.globalData.baseurl + '/user/addfreshnews',
          filePath: that.data.files[i],
          name: 'uploadimg',
          formData: data,
          success: function () {
            that.setData({
              disabledbut:false
            })
            // wx.showModal({
            //   title: '提示',
            //   content: '提交成功',
            //   success: function (res) {
            //     if (res.confirm) {
            //       wx.navigateBack({
            //       })
            //     }
            //   }
            // })

          },
          complete:function(res){
            i = that.data.i +1
            console.log('res is:',res)
            res = JSON.parse(res.data)
            if (i >= that.data.files.length){
              console.log('finish')
              wx.navigateBack({
              })
            }else{
              fnid = res.fnid
              that.setData({
                i: i,
                fnid: fnid
              })
              that.ask(that.data)
            }

          }
        })
      }else{
        //仅有内容
      }

    }



  },

  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, 
      urls: this.data.files 
    })
  },

  cancelask: function (e) {
    var that = this
    wx.request({
      url: app.globalData.baseurl + '/pushformid',
      data: { 'formid': e.detail.formId, 'openid': app.globalData.openid, 'getrole': 'null' },
      success: function (res) {
      }
    })
    app.globalData.placeholder = ''
    wx.navigateBack({
      
    })
  },
 onShow:function(){
 }


})