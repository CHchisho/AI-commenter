import express from 'express';
import { body } from 'express-validator';
import { validate } from '../../middlewares';
import { thumbnailPost } from '../controllers/thumbnailController';

const router = express.Router();

router
  .route('/')
  .post(
    body('topic').trim().notEmpty().withMessage('topic is required'),
    body('extraDetails').optional().isString().trim(),
    validate,
    thumbnailPost
  );

export default router;
