const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
app.use(cors()); // 允许你的 Vue 本地跨域请求

const BASE_URL = 'http://www.yinghuacd.com'; // 樱花动漫的一个常见域名（可能会变）

// 1. 获取首页推荐/列表
app.get('/api/home', async (req, res) => {
  try {
    // 发起 HTTP 请求获取 HTML
    const { data } = await axios.get(BASE_URL);
    // 加载 HTML 到 Cheerio (类似于 jQuery)
    const $ = cheerio.load(data);
    
    const recommendList = [];
    
    // 分析 DOM 结构 (需要你按 F12 去看目标网站的结构)
    // 假设它的列表在一个 class 为 .firs.l 的 ul 里
    $('.firs.l li').each((i, el) => {
      const title = $(el).find('img').attr('alt');
      const cover = $(el).find('img').attr('src');
      const link = $(el).find('a').attr('href'); // e.g., /show/123.html
      
      recommendList.push({
        title,
        cover,
        id: link.replace('/show/', '').replace('.html', ''), // 提取 ID
      });
    });

    res.json({ code: 200, data: recommendList });
  } catch (e) {
    res.status(500).json({ error: '爬取失败' });
  }
});

// 2. 获取详情页 + 播放列表
app.get('/api/detail/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { data } = await axios.get(`${BASE_URL}/show/${id}.html`);
    const $ = cheerio.load(data);
    
    // 提取基础信息
    const title = $('h1').text();
    const desc = $('.info').text();
    
    // 提取播放列表
    const episodes = [];
    $('.movurl li').each((i, el) => {
      const epTitle = $(el).find('a').text();
      const playUrl = $(el).find('a').attr('href'); // e.g., /v/123-1.html
      episodes.push({ num: i + 1, title: epTitle, url: playUrl });
    });

    res.json({ code: 200, data: { title, desc, episodes } });
  } catch (e) {
    res.status(500).json({ error: '获取详情失败' });
  }
});

// 3. 解析真实播放地址 (最难的一步)
// 通常详情页只有一个 iframe，你需要再请求一次播放页，提取 iframe 里的 m3u8 地址
app.get('/api/play', async (req, res) => {
  const { url } = req.query; // 传入 /v/123-1.html
  try {
    const { data } = await axios.get(`${BASE_URL}${url}`);
    // 这里通常需要正则匹配，因为播放地址通常在 script 标签里
    // 比如: var v_url = "https://...m3u8";
    const m3u8Match = data.match(/v_url\s*=\s*"(.*?)"/);
    
    if (m3u8Match) {
      res.json({ code: 200, playUrl: m3u8Match[1] });
    } else {
      res.json({ code: 404, msg: '未找到视频地址' });
    }
  } catch (e) {
    res.status(500).json({ error: '解析失败' });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});