// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    messages: [],
    skip: 0, // 0 为第一页
    limit: 10, // 分页大小
    noMoreData: false, // 数据是否加载完毕
    isLoading: false, // 正在加载，节流
    needRefresh: false
  },
  // 如果是自己首页加载，如果是进入别人空间 展示别人的board？
  loadMessages: function(boardid) {
    if (!boardid) {
      console.error('boardid 未定义，无法加载留言')
      return
    }
    // console.log('boardid:', boardid)
    wx.cloud.callFunction({
      name: 'loadMessages',
      data: {
        boardid: boardid
      }
    }).then(res => {
      // console.log(res)
      if (res.result && res.result.code == 0) {
        this.setData({
          messages: res.result.messages
        })
      } else {
        console.error('loadMessages 失败：', res.result.message)
      }
    }).catch(err => {
      console.error('云函数调用失败', err)
    })
  },
  addMessage: function() {
    // todo： 这里先自己给自己留言
    // const openid = this.data.userInfo._openid
    const boardid = this.data.userInfo.boardid
    wx.navigateTo({
      url: `/pages/add/add?boardid=${boardid}`,
    })
  },

  onScrollToLower: function() {
    console.log('触发scrollTOLower')
  },

  /**
   * 生命周期函数--监听页面加载
   * todo: onload页面加载时，能否再login的云函数中 直接获取到该用户的messages信息，直接返回，而不是login云函数之后，再调用一次 loadMessages云函数
   * todo: onload的参数中有可能能传入别人的boardid
   */
  onLoad(options) {
    wx.cloud.callFunction({
      name: 'login'
    }).then(res => {
      // console.log(res.result)
      this.setData({
        userInfo: res.result.userInfo
      }, () => {
        // setData成功之后的回调，确保 userInfo已经设置
        // 加载留言信息, 传入自己额board
        // const boardid = options.boardid || this.data.userInfo.boardid
        this.loadMessages(this.data.userInfo.boardid)
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 检测页面是否需要刷新留言列表
    if (this.data.needRefresh) {
      const boardid = this.data.userInfo.boardid
      this.loadMessages(boardid)
      // 刷新留言列表之后，重置 needRefresh 的值
      this.setData({ needRefresh: false })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})