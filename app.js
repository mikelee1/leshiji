//app.js
App({
  globalData: {
    avatar: "stranger",
    baseurl: "http://192.168.43.153:8080",
    hasUserInfo: false,
    firstauthorized: 'false',
    fromgetuserinfo: false,
    nickname: '路人甲',
    openid: null,
    screenwidth: 0,
    screenheight: 0,
    userInfo: null,
    userlongitude: 0,
    userlatitude: 0,
    
  },
  onLaunch: function () {
    var that = this
    wx.clearStorageSync()
    wx.login({
      success: res => {
        wx.request({
          data: { js_code: res.code },
          url: this.globalData.baseurl + '/user/getopenid',
          method: 'POST',
          success: function (res) {
            
            that.globalData.openid = res.data.openid
            console.log(res)
          },
        })
      }
    })



    var a = wx.getSystemInfoSync()
    that.globalData.screenwidth = a.windowWidth
    that.globalData.screenheight = a.windowHeight


  }
})