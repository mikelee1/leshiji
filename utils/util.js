const app = getApp();
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function checkuserinfo(that) {

  console.log(app)
  wx.getSetting({
    success: function (res) {
      if (res.authSetting['scope.userInfo']) {
        wx.getUserInfo({
          success: res => {
            app.globalData.userInfo = res.userInfo
            app.globalData.avatar = res.userInfo.avatarUrl
            app.globalData.nickname = res.userInfo.nickName

            if (app.userInfoReadyCallback) {
              app.userInfoReadyCallback(res)
            }
            loading(that)
          }, complete: function (res) {

          }
        })
      }
      else {
        wx.navigateTo({
          url: '/pages/getuserinfo/getuserinfo',
        })
      }
    },
    fail: function (res) {
    }
  })
}


function loading(that) {
  if (app.globalData.avatar != 'stranger') {
    wx.showToast({
      title: '加载完成~',
    })
    // uploadavatar()
    that.onShow()
  } else {
    setTimeout(function () {
      wx.showLoading({
        title: '加载中',
      })
      loading(that)
    }, 100)
  }
}

module.exports = {
  formatTime: formatTime,
  checkuserinfo: checkuserinfo,
  loading: loading,
}
