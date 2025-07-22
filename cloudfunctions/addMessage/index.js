// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  // 接收参数
  const { boardid, content } = event

  // todo: 身份验证么？
  try {
    const result = await db.collection('messages').add({
      data: {
        openid,
        boardid,
        content,
        images: [],
        createdAt: db.serverDate()
      }
    })
    return { code: 0, data: result }
  } catch (err) {
    return { code: 500, message: err.message }
  }
}