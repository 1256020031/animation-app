// src/api/index.js 或 yhdm.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000'   // ← 改成这行（开发时）
  // 部署后改成你的线上域名
})

// 获取轮播图列表
export const getBanners = () => api.get('/api/banners')

// 获取新番列表
export const getNewAnime = () => api.get('/api/animes/new')

// 获取热门连载
export const getHotAnime = () => api.get('/api/animes/hot')
// 获取经典推荐
export const getClassicRecommend = () => api.get('/api/animes/recommend')
// 获取完结列表
export const getFinishedList = () => api.get('/api/animes/finished')
