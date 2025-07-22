// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const db = cloud.database()
  const userId = wxContext.OPENID
  const userDoc = await db.collection('users').doc(userId).get().catch(() => null)

  if (!userDoc) {
    // 新用户，添加createdAt
    await db.collection('users').doc(userId).set({
      data:{
        nickName: event.nickName,
        avatarUrl: event.avatarUrl,
        boardName: "我的留言板",
        boardid: userId,
        visitedBoards: [],
        createdAt: db.serverDate(),
        loginAt: db.serverDate()
      }
    })
  } else {
    // 老用户，更新数据； todo：需要更新的数据
    await db.collection('users').doc(userId).update({
      data:{
        nickName: event.nickName,
        avatarUrl: event.avatarUrl,
        loginAt: db.serverDate()
      }
    })
  }
  
  // 读取用户信息
  const user = await db.collection('users').doc(userId).get()

  return {
    openid: wxContext.openid,
    userInfo: user.data || {}
    // event,
    // openid: wxContext.OPENID,
    // appid: wxContext.APPID,
    // unionid: wxContext.UNIONID,
  }
}