import express from 'express';
import { createProductController, getProductsController } from '../controllers/product.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { createProductSchema } from '../validation/product.validation.js';

const router = express.Router();

router.post('/', validate(createProductSchema), createProductController);

router.get('/', getProductsController);

export default router;
