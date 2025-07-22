const db = wx.cloud.database();
const _ = db.command;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    boardid:'',
    content: '' // 留言内容
  },

  onInput(e) {
    // console.log(e)
    this.setData({
      content: e.detail.value
    })
  },

  submitMessage() {
    const pages = getCurrentPages()
    console.log('submit 页面栈：', pages.length)
    const boardid = this.data.boardid;
    const content = this.data.content;
    if (!content) {
      wx.showToast({
        title: '留言不能为空',
        icon: 'none'
      });
      return;
    }
    // todo: 这里boardid信息也会出现未定义，即此时data.boardid的值还未被设置
    console.log('submit:', boardid, this.data.content)
    // 调用云函数写入数据库
    wx.cloud.callFunction({
      name: 'addMessage',
      data: {
        boardid: boardid,
        content: content
      }
    }).then(res => {
      console.log(res)
      if (res.result.code == 0) {
        wx.showToast({
          title: '留言成功',
          icon: 'success',
          duration: 1500,
          success() {
            const pages = getCurrentPages()
            const indexPage = pages[pages.length - 2] // 上一个页面的索引，所以-2
            // 给index页面传递 刷新留言列表 的标志
            indexPage.setData({
              needRefresh:true
            })
            // 提交之后，展示完toast，返回上一个页面，navigator默认参数是1,即返回一级
            wx.navigateBack();
          }
        })
      } else {
        wx.showToast({
          title: res.result.message,
          icon: 'none'
        })
      }
    }).catch(err => {
      wx.showToast({
        title: '留言失败，请重试',
        icon: 'none'
      })
      console.log(err)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   * 接收 navigatorTo的参数
   */
  onLoad(options) {
    // 这里接收的参数 未定义 
    console.log('接收参数：', options)
    this.setData({
      boardid: options.boardid
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