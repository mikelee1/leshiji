const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarpath:null,
    bgimgpath:null,
    myname:'',
    myavatar:'',
    allfns:[],
    tenfns:[],
    changedbgimg:'',
    hide:true,
    offset:0,
    showbgimgpath:false,
    zancomhidelist:[],
    hideinput:true,
    lovehidelist: [],
    disablefasong:true,
    commentdesc:"",
    bezanorcomindex:null,
    bezanorcomfnid:null,
    bezanorcomopenid:null,
    fnsowner:null,
    top:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      allfns:[]
    })
    that.getfns(that.data.offset)
    // wx.hideTabBar({
    //   aniamtion:true
    // })
  },

  getfns:function(offset){
    
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    wx.request({
      url: app.globalData.baseurl + '/user/gettenfreshnews',
      data: { 'openid': app.globalData.openid, 'offset': offset },
      method: "post",
      success: function (res) {
        wx.hideLoading()

        if(res.data['freshNews']==undefined){
          wx.showToast({
            title: '到底咯',
          })
        }else{

          var a = Array.apply(null, Array(res.data["freshNews"].length)).map(() => true)
          that.setData({
            allfns: that.data.allfns.concat(res.data['freshNews']),
            zancomhidelist: that.data.zancomhidelist.concat(a),
            // lovehidelist: that.data.lovehidelist.concat(b),
            myname: res.data['myname'],
            myavatar: res.data['myavatar'],
          })
          app.globalData.nickname = res.data['myname']
          app.globalData.avatarpath = res.data['myavatar']
          console.log('allfns is:',that.data.allfns)
          if (res.data['bgimgpath']){
            that.setData({
              bgimgpath: res.data['bgimgpath'],
            })
            app.globalData.bgimgpath = res.data['bgimgpath']
          }
        }

        
        
      },
      complete:function(){
        wx.hideLoading()
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
          formData: {'openid':app.globalData.openid},
          success: function () {
            that.setData({
              disabledbut: false
            })
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




  changebgimg:function(){
    var that = this
    wx.showModal({
      title: '提示',
      content: '修改背景图',
      success:function(e){
        if(e.confirm){
          that.chooseimg()
        }
      }
    })
  },

  showmore:function(e){
    var that = this
    var a = that.data.zancomhidelist
    var b = Array.apply(null, Array(a.length)).map(() => true)
    b[e.currentTarget.dataset.index] = !a[e.currentTarget.dataset.index]
    that.setData({
      zancomhidelist:b,
      bezanorcomindex: e.currentTarget.dataset.index,
      bezanorcomfnid: e.currentTarget.dataset.freshnewsid,
      bezanorcomopenid: e.currentTarget.dataset.useropenid,
    })
  },

  hideinputtext:function(){
    var that = this
    that.setData({
      hideinput:true
    })
  },
  zan:function(e){
    var that = this
    wx.request({
      url: app.globalData.baseurl + '/user/addzan',
      method:'post',
      data: { 'fnid': that.data.bezanorcomfnid, 'zaneropenid': app.globalData.openid,'bezaneropenid':that.data.bezanorcomopenid},
      success:function(e){
        var a = that.data.zancomhidelist
        var b = Array.apply(null, Array(a.length)).map(() => true)
        var allfns = that.data.allfns
        allfns[that.data.bezanorcomindex]['hidelove']=false
        allfns[that.data.bezanorcomindex]['hideall'] = false
        allfns[that.data.bezanorcomindex]['haslove'] = true
        if (allfns[that.data.bezanorcomindex]['zanername']){
          allfns[that.data.bezanorcomindex]['zanername'].push(app.globalData.nickname)
        }else{
          allfns[that.data.bezanorcomindex]['zanername'] = [app.globalData.nickname]
        }
        that.setData({
          zancomhidelist: b,
          allfns:allfns,
        })

      }
    })
  },

  dezan: function (e) {
    var that = this
    wx.request({
      url: app.globalData.baseurl + '/user/deletezan',
      method: 'post',
      data: { 'fnid': that.data.bezanorcomfnid, 'zaneropenid': app.globalData.openid, 'bezaneropenid': that.data.bezanorcomopenid },
      success: function (e) {
        var a = that.data.zancomhidelist
        var b = Array.apply(null, Array(a.length)).map(() => true)
        var allfns = that.data.allfns

        allfns[that.data.bezanorcomindex]['haslove'] = false
        allfns[that.data.bezanorcomindex]['zanername'].splice(allfns[that.data.bezanorcomindex]['zanername'].indexOf(app.globalData.nickname),1)
        
        
        if (allfns[that.data.bezanorcomindex]['zanername'].length==0) {
          allfns[that.data.bezanorcomindex]['hidelove'] = true
          if (allfns[that.data.bezanorcomindex]['hidecomment']) {
            allfns[that.data.bezanorcomindex]['hideall'] = true
          }
        }
 
        that.setData({
          zancomhidelist: b,
          allfns: allfns,
        })

      }
    })
  },

  showcommentinput: function (e) {
    var that = this
    console.log(e.currentTarget.dataset)
    that.setData({
      hideinput:false,
      fnsowner:e.currentTarget.dataset.fnsowner
    })
  },
  comment:function(e){
    var that = this
    var commentdata = { 'commentername': that.data.myname, 'becommentername': that.data.fnsowner,'commenteropenid': app.globalData.openid, 'becommenteropenid': that.data.bezanorcomopenid, 'fnid': that.data.bezanorcomfnid, 'desc': that.data.commentdesc }
    wx.request({
      url: app.globalData.baseurl + '/user/addcomment',
      method:'post',
      data: commentdata,
      success:function(e){
        console.log('comment success')
        that.setData({
          hideinput:true,
        })


        var a = that.data.zancomhidelist
        var b = Array.apply(null, Array(a.length)).map(() => true)
        var allfns = that.data.allfns
        allfns[that.data.bezanorcomindex]['hidecomment'] = false
        allfns[that.data.bezanorcomindex]['hideall'] = false
        if (allfns[that.data.bezanorcomindex]['comment']) {
          allfns[that.data.bezanorcomindex]['comment'].push(commentdata)
        } else {
          allfns[that.data.bezanorcomindex]['comment'] = [commentdata]
        }
        that.setData({
          zancomhidelist: b,
          allfns: allfns,
        })

      }
    })
  },

  inputtext: function (e) {
    var that = this
    if (e.detail.value==""){
      that.setData({
        commentdesc: e.detail.value,
        disablefasong: true
      })
    }else{
      that.setData({
        commentdesc: e.detail.value,
        disablefasong: false
      })
    }

  },

  getselfprofile:function(){
    wx.navigateTo({
      url: '../myfns/myfns',
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
    wx.stopPullDownRefresh();
  },

  onPageScroll:function(e){
    var that = this
    if (e.scrollTop - that.data.top > 100 || that.data.top - e.scrollTop >= 100){
      if (that.data.top - e.scrollTop >= 50) {
        //向下滚动 
        wx.showTabBar({
        })
      } else {
        //向上滚动 
        wx.hideTabBar({
        })
      }
      //给scrollTop重新赋值 
      this.setData({
        top: e.scrollTop
      })
    }
    
  },




  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    var that = this
    var offsetnew = that.data.offset + 1
    that.setData({
      offset:offsetnew
    })
    that.getfns(that.data.offset)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  
  

})