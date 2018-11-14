// map.js
const app = getApp()
var util = require('../../utils/util.js')
Page({
  data: {
    latitude:0,
    longitude:0,
    userlatitude: 0,
    userlongitude: 0,
    centerX:0,
    centerY:0,
    height:app.globalData.screenheight,
    scale:5,
    markerslist: [],
    markers: {},
    peoples: [],
    controls: [{
      id: 1,
      iconPath: '/images/location-control.png',
      position: {
        left: 0,
        top:10,
        width: 40,
        height: 40
      },
      clickable: true
    },
    {
        id: 2,
        iconPath: '/images/plus.png',
        position: {
          left: 0,
          top: 60,
          width: 40,
          height: 40
        },
        clickable: true
      }, {
        id: 3,
        iconPath: '/images/minus.png',
        position: {
          left: 0,
          top: 110,
          width: 40,
          height: 40
        },
        clickable: true
      }, {
        id: 4,
        iconPath: '/images/ren.png',
        position: {
          left: 10,
          top: 160,
          width: 20,
          height: 40
        },
        clickable: true
      } 
    ],
    mapCtx:null
  },
  onReady: function (e) {
    // 使用 wx.createMapContext 获取 map 上下文 
    this.mapCtx = wx.createMapContext('map')
  },
  onLoad: function () {
    var that = this
    util.checkuserinfo(that)
    if (app.globalData.firstauthorized == 'true' || app.globalData.avatar != 'stranger') {
      wx.getLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        success: (res) => {
          let latitude = res.latitude;
          let longitude = res.longitude;
          res.pic = app.globalData.avatar
          let marker = that.createMarker(res);
          that.data.markers.push(marker)
          app.globalData.userlongitude = longitude
          app.globalData.userlatitude = latitude
        
          that.setData({
            centerX: longitude,
            centerY: latitude,
            latitude: res.latitude,
            longitude: res.longitude,
            userlatitude: res.latitude,
            userlongitude: res.longitude,
            scale: 1
          })

          this.adduserlocation()
          this.getSchoolMarkers()
          this.enterLocation()
        }
      });
    }
    

  },
  regionchange(e) {
  },
  markertap(e) {
    console.log(e.markerId)
    wx.navigateTo({
      url: `../freshnewsdetail/freshnewsdetail?freshnewsid=${e.markerId}`,
    })
  },

  controltap(e) {
    var that = this
    wx.vibrateShort({
    })
    if (e.controlId === 1){
      // app.globalData.mapCtx.moveToLocation()
      this.mapCtx.moveToLocation()

    }
    else if (e.controlId === 2) {
      that.getCenterLocation()
      let tmpscale = ++that.data.scale
      if (tmpscale >18){
        tmpscale = 18
      }
      that.setData({
        scale: tmpscale
      })
    } else if (e.controlId === 3) {
      that.getCenterLocation()
      let tmpscale = --that.data.scale
      if (tmpscale < 5) {
        tmpscale = 5
      }
      that.setData({
        scale: tmpscale
      })
    } else {
      that.translateMarker(app.globalData.openid)
    }


  },
  getSchoolMarkers(){
    var that = this

    wx.request({
      url: app.globalData.baseurl + '/user/getalluserfreshnews',
      data: {'openid':app.globalData.openid},
      method:"post",
      success:function(res){
        console.log('res is:',res)
        let markers = {}
        let markerslist = []
        for (var openid in res.data['freshNews']){
          console.log(openid)
          let markerd = that.createMarker({
            'longitude': app.globalData.userlongitude, 'latitude': app.globalData.userlatitude
            , 'pic': app.globalData.avatar, 'freshnewsid': 0
          })

          for (let item of res.data['freshNews'][openid]['freshnews']) {

            let marker = that.createMarker(item);
            if(markers[openid]){
              markers[openid].push(marker)
            }else{
              markers[openid] = [marker]
            }
            markerslist.push(marker)
          }

          if (markers[openid]) {
            markers[openid].push(markerd)
          } else {
            markers[openid] = [markerd]
          }
          markerslist.push(markerd)
        }
        that.setData({
          markers: markers,
          markerslist: markerslist
        })
      }
    })
  },


  createMarker(point) {
    let latitude = point.latitude;
    let longitude = point.longitude;
    let marker = {
      iconPath: point.pic,
      id: point.freshnewsid,
      name: point.username || '',
      latitude: latitude,
      longitude: longitude,
      width: 40,
      height: 40,
      callout: {
        content: point.username,
        color: '#000000',
        fontSize: 15,
        borderRadius: 10,
        display: 'ALWAYS',
      }
    };
    return marker;
  },

  getCenterLocation: function () {
    var that = this
    this.mapCtx.getCenterLocation({
      success: function (res) {
        that.setData({
          centerX: res.longitude,
          centerY: res.latitude,
          latitude: res.latitude,
          longitude: res.longitude, 
        })
      }
    })
  },
  translateMarker(openid) {
    var that = this
    var length = that.data.markers[openid].length
    for (var i=0; i< length;i++){

      console.log('move',this.data.markers[openid][i])
      var p = this.data.markers[openid][i]
      that.mapCtx.translateMarker({
        markerId: 0,
        autoRotate: false,
        duration: 1000,
        destination: {
          latitude: p['latitude'],
          longitude: p['longitude'],
        },
        animationEnd() {
          console.log('animation end')
        }
      })
    }

  },


  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },
  enterLocation:function(){
    this.mapCtx.moveToLocation()
    // app.globalData.mapCtx.moveToLocation()
    this.setData({
      scale: 15,
    })
  },

  adduserlocation:function() {
    var that = this
    wx.request({
      url: app.globalData.baseurl + '/user/adduserlocation',
      data: { 'openid': app.globalData.openid, 'latitude': that.data.userlatitude, 'longitude': that.data.userlongitude },
      method:"post",
      success: function (res) {
      }
    })
  },



  addfreshnews:function(){
    wx.navigateTo({
      url: '../addfreshnews/addfreshnews',
    })
  },

  downloadfile:function(url,id){
    wx.downloadFile({
      url: url,
      success: function (res) {
        var avatarimg = res.tempFilePath
        wx.setStorageSync(string(id), avatarimg)
        var avatarimgcache = wx.getStorageSync(string(id))
        return avatarimgcache
      }
    })
  },
  onShow:function(){
    var that = this
    if (app.globalData.firstauthorized == 'true' || app.globalData.avatar != 'stranger') {
      console.log('onshow')
      wx.getLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        success: (res) => {
          let latitude = res.latitude;
          let longitude = res.longitude;
          let marker = that.createMarker(res);
          app.globalData.userlongitude = longitude
          app.globalData.userlatitude = latitude
          that.setData({
            centerX: longitude,
            centerY: latitude,
            latitude: res.latitude,
            longitude: res.longitude,
            userlatitude: res.latitude,
            userlongitude: res.longitude,
            scale: 1
          })

          this.adduserlocation()
          this.getSchoolMarkers()
          this.enterLocation()
        }
      });
    }

  }

})