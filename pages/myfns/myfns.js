// pages/myfns/myfns.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgimgpath:null,
    myavatar:null,
    myname:null,
    allfns:[],
    offset:0,
    zancomhidelist:[],
    lovehidelist:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      allfns: []
    })
    that.getfns(that.data.offset)

  },
  changebgimg: function () {
    var that = this
    wx.showModal({
      title: '提示',
      content: '修改背景图',
      success: function (e) {
        if (e.confirm) {
          that.chooseimg()
        }
      }
    })
  },
  viewimage: function (e) {
    var image = e.currentTarget.dataset.image
    wx.previewImage({
      current: '',
      urls: [image],
    })
  },


  chooseimg: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const src = res.tempFilePaths[0]
        that.setData({
          bgimgpath: src
        })
        app.globalData.bgimgpath = src
        //上传背景图
        wx.uploadFile({
          url: app.globalData.baseurl + '/user/uploadbgimg',
          filePath: src,
          name: 'uploadimg',
          formData: { 'openid': app.globalData.openid },
          success: function () {
            wx.showModal({
              title: '提示',
              content: '修改成功',
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
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this
    that.setData({
      bgimgpath:app.globalData.bgimgpath,
      myname : app.globalData.nickname,
      myavatar: app.globalData.avatarpath,
    })
    console.log(that.data)
  },

  getfns: function (offset) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    wx.request({
      url: app.globalData.baseurl + '/user/gettenselffreshnews',
      data: { 'openid': app.globalData.openid, 'offset': offset },
      method: "post",
      success: function (res) {
        console.log(res)
        if (res.data['freshNews'] == undefined) {
          wx.showToast({
            title: '到底咯',
          })
        } else {

          var a = Array.apply(null, Array(res.data["freshNews"].length)).map(() => true)
          that.setData({
            allfns: that.data.allfns.concat(res.data['freshNews']),
            zancomhidelist: that.data.zancomhidelist.concat(a),
            // lovehidelist: that.data.lovehidelist.concat(b),
            myname: res.data['myname'],
            myavatar: res.data['myavatar'],
          })
          // app.globalData.nickname = res.data['myname']
          // app.globalData.avatarpath = res.data['myavatar']
          console.log('allfns is:', that.data.allfns)
          if (res.data['bgimgpath']) {
            that.setData({
              bgimgpath: res.data['bgimgpath'],
            })
            app.globalData.bgimgpath = res.data['bgimgpath']
          }
        }



      },
      complete: function () {
        wx.hideLoading()
      }
    })

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
    var that = this
    that.setData({
      allfns: [],
      offset: 0
    })
    that.getfns(that.data.offset)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    var offsetnew = that.data.offset + 1
    that.setData({
      offset: offsetnew
    })
    that.getfns(that.data.offset)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})