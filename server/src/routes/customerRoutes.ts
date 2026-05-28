import { Router } from 'express';
import { customerController } from '../controllers/customerController.js';

const router = Router();

router.get('/', (req, res, next) => customerController.getAll(req, res, next));
router.get('/search', (req, res, next) => customerController.search(req, res, next));
router.get('/:custref', (req, res, next) => customerController.getOne(req, res, next));
router.post('/', (req, res, next) => customerController.create(req, res, next));
router.put('/:custref', (req, res, next) => customerController.update(req, res, next));
router.delete('/:custref', (req, res, next) => customerController.delete(req, res, next));

export default router;
