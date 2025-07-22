// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  console.time('cloudFunction')
  const wxContext = cloud.getWXContext()
  // 解构参数 boarid 必须与调用云函数时传入的字段一致
  const { boardid, skip = 0, limit = 20 } = event
  if (!boardid) {
    return {
      code: 1,
      message: '参数 boardid 缺失'
    }
  }
  try {
    // 1、获取留言总数 { total: number }
    const countResult = await db.collection('messages')
      .where({ boardid })
      .count()
    const total = countResult.total || 0
    // 2、分页查询
    const messagesRes = await db.collection('messages')
      .where({ boardid })
      .orderBy('createdAt', 'desc')
      .skip(skip)
      .limit(limit)
      .get()
    console.timeEnd('cloudFunction')
    return {
      code: 0,
      openid: wxContext.OPENID,
      total: total,
      messages: messagesRes.data || []
    }
  } catch (err) {
    return {
      code: -1,
      message: err.message
    }
  }
}