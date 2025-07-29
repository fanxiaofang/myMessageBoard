
// const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
const defaultAvatarUrl1 = 'cloud://cloud1-4gxx0ejm50ee913a.636c-cloud1-4gxx0ejm50ee913a-1367623107/defaultAvatars/infp22.png'
const defaultAvatarUrl2 = 'cloud://cloud1-4gxx0ejm50ee913a.636c-cloud1-4gxx0ejm50ee913a-1367623107/defaultAvatars/infp11.png'
const defaultAvatarUrl = defaultAvatarUrl2
Page({
  data: {
    avatarUrl: '',
    boardname:'',
    nickname:'',
    mybless:'', // 正式寄语

    editedNickname: '',
    editedBoardname: '',
    editedMybless: '',
    isEdited: false,
  },
  onChooseAvatar(e) {
    console.log(e)
    const { avatarUrl } = e.detail 
    console.log(avatarUrl)
    // 先显示临时头像
    this.setData({
      avatarUrl,
    })
    // 上传临时文件到云存储
    wx.cloud.uploadFile({
      cloudPath: `avatars/${Date.now()}-${Math.floor(Math.random()*1000)}.png`,
      filePath: avatarUrl, // 临时文件路径
      success: res => {
        const fileId = res.fileID
        console.log('上传成功，fileid：', fileId);
        // 调用云函数 更新数据
        wx.cloud.callFunction({
          name: 'updateUserInfo',
          data: {
            updateData: {
              avatarUrl: fileId
            }
          }
        }).then(res1 => {
          console.log(res1)
          if (res1.result.code == 0) {
            this.setData({
              avatarUrl: res1.result.data.avatarUrl
            }, () => {
              wx.showToast({
                title: '上传成功',
                icon: 'success',
                duration: 1500
              })
            })
          }
        }).catch(err1 => {
          wx.showToast({
            title: '上传失败',
            icon: 'none'
          })
        })
      },
      fail: err => {
        console.error('上传失败：', err)
      }
    })

  },
  onInputNickName(e) {
    this.setData({
      editedNickname: e.detail.value
    }, this.checkEdited)
    // console.log(e)
  },
  onInputBoardName(e) {
    this.setData({
      editedBoardname: e.detail.value
    }, this.checkEdited)
  },

  onInputBless(e) {
    this.setData({
      editedMybless: e.detail.value
    }, this.checkEdited)
  },
  // 检查当前编辑内容是否与原始内容不同
  checkEdited() {
    const {
      nickname,
      boardname,
      mybless,
      editedNickname,
      editedBoardname,
      editedMybless,
    } = this.data;

    const isEdited =
      nickname !== editedNickname ||
      boardname !== editedBoardname ||
      mybless !== editedMybless;

    this.setData({ isEdited });
  },

  // 保存按钮点击事件
  onSave() {
    // 这里执行保存操作，比如调用后端接口或本地存储
    // 调用云函数 更新数据
    wx.cloud.callFunction({
      name: 'updateUserInfo',
      data: {
        updateData: {
          boardName:this.data.editedBoardname,
          nickName:this.data.editedNickname,
          myBless: this.data.editedMybless
        }
      }
    }).then(res => {
      console.log(res)
      if (res.result.code == 0) {
        // 云存储更新成功后，同步原始数据
        this.setData({
          nickname: this.data.editedNickname,
          boardname: this.data.editedBoardname,
          mybless: this.data.editedMybless,
          isEdited: false,
        }, () => {
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 1500
          })
        })
      }
    }).catch(err => {
      wx.showToast({
        title: '保存失败',
        icon: 'none'
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取 我 的数据，保存到 data数据中
    // 从数据库中拉取用户信息，这里拉取自己的信息，不用传_id 参数，默认是查询自己的信息
    wx.cloud.callFunction({
      name: 'loadUserInfo'
    }).then(res => {
      console.log(res)
      const userData = res.result.data

      this.setData({
        avatarUrl: userData.avatarUrl,
        boardname: userData.boardName,
        nickname: userData.nickName,
        mybless: userData.myBless,
    
        editedNickname: userData.nickName,
        editedBoardname: userData.boardName,
        editedMybless: userData.myBless,
        isEdited: false,
      })
    }).catch(err => {
      console.log(err)
      wx.showToast({
        title: '获取用户信息失败',
        icon: 'error'
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