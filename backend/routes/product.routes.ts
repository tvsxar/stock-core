import express from 'express';
import { createProductController } from '../controllers/product.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { createProductSchema } from '../validation/product.validation.js';

const router = express.Router();

router.post('/', validate(createProductSchema), createProductController);

export default router;
