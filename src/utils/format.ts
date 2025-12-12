/**
 * 格式化播放量
 * 若数值超过10000，则格式化为'X万'形式，保留一位小数
 * @param views - 播放量（字符串或数字）
 * @returns 格式化后的播放量字符串
 */
export const formatViews = (views: string | number): string => {
  // 如果是字符串且已经包含"万"或"亿"，直接返回
  if (typeof views === 'string' && (views.includes('万') || views.includes('亿'))) {
    return views;
  }
  
  // 尝试将字符串转换为数字
  const num = typeof views === 'number' ? views : parseFloat(views);
  if (isNaN(num)) {
    return String(views);
  }
  
  // 超过1亿，转换为亿单位
  if (num >= 100000000) {
    return (num / 100000000).toFixed(1) + '亿';
  }
  
  // 超过1万，转换为万单位
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万';
  }
  
  return String(num);
};

/**
 * 格式化数字（通用方法）
 * @param num - 数字
 * @returns 格式化后的字符串
 */
export const formatNumber = (num: number | string): string => {
  return formatViews(num);
};
