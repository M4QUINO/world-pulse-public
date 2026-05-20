const fs = require('fs');
const path = require('path');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const cron = require('node-cron');
require('dotenv').config();

const { addComment, getCommentsBySlug, getTrendingDebates, seedCommentsStore } = require('./services/commentsService');
const { getEditorial, getFeed, getMeta, getNews, fetchNewNews, seedStore } = require('./services/newsService');
const { getStudyHubData, searchStudyMaterials } = require('./services/studentResearchService');
const { getTodayBrief } = require('./services/todayService');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 3001;
const UPDATE_INTERVAL_HOURS = Number(process.env.UPDATE_INTERVAL_HOURS || 3);
const FRONTEND_DIST_PATH = path.resolve(__dirname, '../../frontend/dist');
const FRONTEND_INDEX_PATH = path.join(FRONTEND_DIST_PATH, 'index.html');

app.use(cors());
app.use(express.json());

seedStore(false);
seedCommentsStore(false);

if (fs.existsSync(FRONTEND_INDEX_PATH)) {
  app.use(express.static(FRONTEND_DIST_PATH));
}

// Routes
app.get('/api/news', (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const news = getNews(page);
  res.json(news);
});

app.get('/api/feed', (req, res) => {
  res.json(
    getFeed({
      page: req.query.page,
      limit: req.query.limit,
      category: req.query.category,
      search: req.query.q,
    }),
  );
});

app.get('/api/news/servis', (req, res) => {
  const news = getNews();
  const servisNews = news.filter((item) => item.scope === 'servis');
  res.json(servisNews);
});

app.get('/api/meta', (req, res) => {
  res.json(getMeta());
});

app.get('/api/editorial', (req, res) => {
  res.json(getEditorial());
});

app.get('/api/study/hub', (req, res) => {
  res.json(getStudyHubData());
});

app.get('/api/study/search', (req, res) => {
  res.json(
    searchStudyMaterials({
      query: req.query.q,
      type: req.query.type,
      area: req.query.area,
      level: req.query.level,
      limit: req.query.limit,
    }),
  );
});

app.get('/api/today', (req, res) => {
  res.json(getTodayBrief());
});

app.get('/api/debates', (req, res) => {
  res.json(getTrendingDebates(getNews()));
});

app.get('/api/comments/:slug', (req, res) => {
  const comments = getCommentsBySlug(req.params.slug);
  res.json({
    slug: req.params.slug,
    count: comments.length,
    comments,
  });
});

app.post('/api/comments/:slug', (req, res) => {
  try {
    const result = addComment(req.params.slug, req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message || 'Nao foi possivel publicar o comentario.',
    });
  }
});

// Manual trigger for testing
app.post('/api/news/refresh', async (req, res) => {
  const newItems = await fetchNewNews();
  if (newItems.length > 0) {
    io.emit('new-news', newItems[0]);
  }

  res.json({
    message: 'Atualizacao concluida',
    news: newItems,
    meta: getMeta(),
    editorial: getEditorial(),
  });
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const cronExpression = `0 */${Math.min(Math.max(UPDATE_INTERVAL_HOURS, 1), 12)} * * *`;

cron.schedule(cronExpression, async () => {
  const newItems = await fetchNewNews();
  if (newItems.length > 0) {
    io.emit('new-news', newItems[0]);
  }
});

if (fs.existsSync(FRONTEND_INDEX_PATH)) {
  app.get(/^(?!\/api|\/socket\.io).*/, (req, res) => {
    res.sendFile(FRONTEND_INDEX_PATH);
  });
}

server.listen(PORT, () => {
  console.log(`World Pulse backend ativo na porta ${PORT}`);
});
