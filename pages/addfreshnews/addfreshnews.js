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
    img: 'noimage',
    askpicdoor:false,
    avatar:app.globalData.avatar,
    screenwidth:app.globalData.screenwidth,
    screenheight: app.globalData.screenheight,
    imagelength:0,
    disabledbut:false
  },


  rewardinput: function (e) {
    this.setData({
      reward: e.detail.value
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
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const src = res.tempFilePaths[0]
        that.setData({
          files: [src],
          imagelength:1,
          problempicsrc: src,
          askpicdoor:true,
          img: src
        })
      }
    })
  },


  ask: function (e) {
    var that = this
    // wx.request({
    //   url: app.globalData.baseurl + '/pushformid',
    //   data: { 'formid': e.detail.formId, 'openid': app.globalData.openid, 'getrole': 'null' },
    //   success: function (res) {
    //   }
    // })
    if (this.data.desc==''){
      wx.showModal({
        title: '提示',
        content: '请输入描述',
      })
    }else{

      this.setData({
        hide: false,
        disabledbut:true,
        userid: app.globalData.openid,
        avatar: app.globalData.avatar,
      })
      
      if (this.data.img != 'noimage') {
        // wx.uploadFile({
        //   url: app.globalData.baseurl + '/ask/',
        //   filePath: this.data.img,
        //   name: 'problempic',
        //   formData: this.data,
        //   success: function () {
        //     that.setData({
        //       disabledbut:false
        //     })
        //     wx.showModal({
        //       title: '提示',
        //       content: '提问成功',
        //       success: function (res) {
        //         if (res.confirm) {
        //           wx.navigateBack({
        //           })
        //         }
        //       }
        //     })
        //   }
        // })
        var data = { 'openid': app.globalData.openid, 'longitude': app.globalData.userlongitude, 'latitude': app.globalData.userlatitude, 'desc': that.data.desc }
        wx.uploadFile({
          url: app.globalData.baseurl + '/user/addfreshnews',
          filePath: that.data.img,
          name: 'uploadimg',
          formData: data,
          success: function () {
            that.setData({
              disabledbut:false
            })
            wx.showModal({
              title: '提示',
              content: '提交成功',
              success: function (res) {
                if (res.confirm) {
                  wx.navigateBack({
                  })
                }
              }
            })
          }
        })


      }
      // else {
      //   wx.request({
      //     url: app.globalData.baseurl + '/user/addfreshnews',
      //     method: 'post',
      //     header: {
      //       "Content-Type": "application/x-www-form-urlencoded"
      //     },
      //     data: this.data,
      //     success: function () {
      //       that.setData({
      //         disabledbut: false
      //       })
      //       wx.showModal({
      //         title: '提示',
      //         content: '提问成功',
      //         success: function (res) {
      //           if (res.confirm) {
      //             app.globalData.placeholder = ''
      //             wx.navigateBack({
      //             })
      //           } else if (res.cancel) {
      //           }
      //         }
      //       })

      //     },


      //   })

      // }

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
  //  this.setData({
  //    placeholder: app.globalData.placeholder
  //  })
 }


})