import express from 'express';
import { createProductController, getProductsController, updateProductController, getProductController } from '../controllers/product.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { createProductSchema, updateProductSchema, productIdParamsSchema } from '../validation/product.validation.js';

const router = express.Router();

router.post('/', validate(createProductSchema, 'body'), createProductController);

router.get('/', getProductsController);

router.get('/:id', validate(productIdParamsSchema, 'params'), getProductController);

router.patch('/:id', validate(productIdParamsSchema, 'params'), validate(updateProductSchema, 'body'), updateProductController);

export default router;
