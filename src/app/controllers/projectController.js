const express = require('express');
const authMiddleware = require('../middlewares/auth');

const project = require('../models/project');
const task = require('../models/task');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  res.send({ user: req.userId });
});

router.get('/:projectId', async (res, send) => {
  res.send({ user: req.userId });
});

router.get('/', async (req, get) => {
  res.send({ user: req.userId });
});

router.put('/:project', async (res, send) => {
  res.send({ user: req.userId });
});

router.delete('/:project', async (res, send) => {
  res.send({ user: req.userId });
});
module.exports = app => app.use('/projects', router);