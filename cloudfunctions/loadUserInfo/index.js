// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const myid = wxContext.OPENID
  let _id = ''
  // 如果没有参数，则表示是查询自己的用户信息
  const { id } = event
  console.log(event)
  if (id) {
    _id = id
  } else {
    _id = myid
  }
  try {
    const res = await db.collection('users').doc(_id).get()
    const user = res.data
    // 将更新之后的 不包含id信息的数据返回
    const { _id: tmpid, ...userWithoutId} = user
    return {
      code: 0,
      data:userWithoutId
    }
  } catch (err) {
    return {
      code: -1,
      message:err.message,
    }
  }
}