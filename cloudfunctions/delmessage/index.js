// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  // 如果该openid是登录者的openid，那么根据当前业务的设定，留言板的主人可以删除自己的留言，那还有必要调用该删除留言的云函数时，传递boardid么
  const openid = wxContext.OPENID
  // 接收参数: 留言板id，要删除的message id
  const { boardid, msgid } = event

  if (!boardid || !msgid) {
    return { code: 400, message: '参数 boardid 和 megid必须提供'}
  }

  try {
    const messageRes = await db.collection('messages')
      .where({
        _id: msgid,
        boardid: boardid
      })
      .get()
    if (messageRes.data.length == 0) {
      return { code: 404, message: '留言不存在'}
    }
    const message = messageRes.data[0]
    // 判断调用者是否有权限删除，这里只允许留言板主人可以删除，todo：留言者是否可以删除
    if (message.openid != openid) {
      return { code: 403, message: '不是主人，没有权限删除'}
    }
    // 删除留言
    const delRes = await db.collection('messages').doc(msgid).remove()
    return { code: 0, message:'删除成功', data: delRes}
  } catch (err) {
    return { code: 500, message: err.message }
  }
}