// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  // userinfo 的openid为数据集合索引
  const _id =  wxContext.OPENID 
  const updateData = event.updateData 

  if (!updateData || typeof updateData !== 'object') {
    return { code: -1, message: '参数错误'}
  }
  const newAvatarUrl = updateData.avatarUrl

  try {
    // 1、更新之前，获取旧数据
    const userRes = await db.collection('users').doc(_id).get()
    const oldUser = userRes.data || {}

    // 2、动态更新
    await db.collection('users').doc(_id).update({
      data: updateData
    })
    // 2 、更新数据之后，判断如果是更新的头像信息，则删除旧的头像，防止云存储占据过多空间
    if (newAvatarUrl) {
      const oldAvatarUrl = oldUser.avatarUrl
      const defaultAvatarMarkers = [
        '../../images/infp11.png',
        '../../images/infp22.png'
      ]
      // 确保旧头像存在，且不是默认头像
      if (oldAvatarUrl && !defaultAvatarMarkers.some(marker => oldAvatarUrl.includes(marker))) {
        try {
          if (oldAvatarUrl.startsWith('cloud://')) {
            await cloud.deleteFile({
              fileList: [oldAvatarUrl]
            })
            console.log('旧头像删除成功:', oldAvatarUrl)
          } else {
            console.warn('旧头像不是云文件ID，跳过删除:', oldAvatarUrl)
          }
        } catch (e) {
          console.warn('旧头像删除失败（可能文件不存在或已被删除）:', e)
        }
      }
    }

    // 3 、返回更新后的数据
    const res = await db.collection('users').doc(_id).get()
    const user = res.data
    // 将更新之后的 不包含id信息的数据返回
    const { _id: id, ...userWithoutId} = user
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