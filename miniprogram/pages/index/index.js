const util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    messages: [],
    needRefresh: false, // 是否需要刷新页面
    skip: 0, // 0 为第一页
    limit: 20, // 分页大小
    noMoreData: false, // 数据是否加载完毕
    isLoading: false, // 正在加载中，节流，防止多次请求
  },
  pageData: {

  },
  // 如果是自己首页加载，如果是进入别人空间 展示别人的board？
  // boardid: 留言板id；reset：是否从首页重新开始展示
  loadMessages: function(boardid, reset = false) {
    if (!boardid) {
      console.error('boardid 未定义，无法加载留言')
      return
    }
    // 如果已经没有新数据, 直接返回
    if (this.data.noMoreData) return
    if (this.data.isLoading) return

    // 如果指定reset，需要重置一些数据
    if (reset) {
      this.setData({
        skip: 0,
        noMoreData: false,
        messages: []
      })
    }

    // 发起请求之前，将isLoading正在加载状态设置为true，防止同时多次请求
    this.setData({ isLoading: true })

    // 调用云函数，获取一页数据
    wx.cloud.callFunction({
      name: 'loadMessages',
      data: {
        boardid: boardid,
        skip: this.data.skip,
        limit: this.data.limit
      }
    }).then(res => {
      if (res.result && res.result.code == 0) {
        let oldMessages = reset ? [] : this.data.messages
        let newMessages = res.result.messages || []

        // 使用 formatDateTime 格式化时间字段，新增 simpleTime 字段
        newMessages = newMessages.map(item => ({
          ...item,
          simpleTime: util.formatDateTime(item.createdAt)
        }))
        console.log('newmessage length:', newMessages.length)
        // 第一页,无需拼接，清空旧数据
        // if (this.data.skip == 0) {
        //   oldMessages = []
        // }
        // 拼接数据, 如果最后一页，noMoreData设置为true
        this.setData({
          messages: oldMessages.concat(newMessages),
          skip: this.data.skip + newMessages.length,
          noMoreData: newMessages.length < this.data.limit
        })
        // 数据加载完毕时，是否需要提示: wx.showToast
      } else {
        console.error('loadMessages 失败：', res.result.message)
      }
    }).catch(err => {
      console.error('云函数调用失败', err)
    }).finally(() => {
      // wx.hideLoading();
      // 请求完成之后，将isLoading 置为false，表示可以发起下一次请求
      this.setData({ isLoading: false })
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
    if (this.data.isLoading || this.data.noMoreData) return
    // console.log('触发scrollTOLower')
    this.loadMessages(this.data.userInfo.boardid)
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
        let reset = true
        this.loadMessages(this.data.userInfo.boardid, reset)
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
      let reset = true
      this.loadMessages(boardid, reset)
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