// 简化 标准的ISO 8601格式的UTC时间字符串："2025-07-21T14:19:45.798Z"
function formatDateTime(isoStr) {
  if (!isoStr) return ''
  const date = new Date(isoStr);
  const Y = date.getFullYear();
  const M = (date.getMonth() + 1).toString().padStart(2, '0');
  const D = date.getDate().toString().padStart(2, '0');
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');

  return `${Y}-${M}-${D} ${h}:${m}`;
}

// 导出函数，方便页面调用
module.exports = {
  formatDateTime
}