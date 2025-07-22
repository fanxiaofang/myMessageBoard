// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  // 检查用户是否存在
  const db = cloud.database()
  const user = await db.collection('users')
    .where({ _openid: wxContext.OPENID })
    .get()
  
  if (user.data.length == 0) {
    // 新用户注册
    await db.collection('users').add({
      data: {
        _openid: wxContext.OPENID,
        nickName: event.nickName,
        avatarUrl: event.avatarUrl,
        boardName: "我的留言板",
        boardid: wxContext.OPENID,
        visitedBoards:[],
        createdAt: db.serverDate()
      }
    })
  }

  return {
    openid: wxContext.openid,
    userInfo: user.data[0] || {}
    // event,
    // openid: wxContext.OPENID,
    // appid: wxContext.APPID,
    // unionid: wxContext.UNIONID,
  }
}