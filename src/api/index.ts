import express from 'express';

import commentRoute from './routes/commentRoute';
import thumbnailRoute from './routes/thumbnailRoute';

import { MessageResponse } from '../types/MessageTypes';

const router = express.Router();

router.get<{}, MessageResponse>('/', (_req, res) => {
  res.json({
    message: 'routes: comments, thumbnails',
  });
});

router.use('/comments', commentRoute);
router.use('/thumbnails', thumbnailRoute);

export default router;
