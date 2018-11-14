// pages/freshnewsdetail/freshnewsdetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    freshnewsid:null,
    avatarpath:null,
    desc:null,
    longitude:null,
    latitude:null,
    pic:[],
    time:null,
    username:null,
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      freshnewsid : options.freshnewsid
    })
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
    var that = this
    wx.request({
      url: app.globalData.baseurl + '/user/getfreshnewsdetail',
      method:"post",
      data: { 'freshnewsid': parseInt(that.data.freshnewsid),'openid':app.globalData.openid},

      success:function(e){
        console.log(e)
        
        that.setData({
          avatarpath: e.data.freshNews.avatarpath,
          desc: e.data.freshNews.desc,
          longitude: e.data.freshNews.longitude,
          latitude: e.data.freshNews.latitude,
          pic: e.data.freshNews.pic,
          time: e.data.freshNews.time,
          username: e.data.freshNews.username,


        })
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
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})