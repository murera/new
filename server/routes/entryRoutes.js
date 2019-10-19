import express from 'express';
import entry from '../controllers/entryControllers';
import helper from '../middlewares/helpers';
const router = express.Router();
router.get('/', helper.verifyToken, entry.findAll);
router.post('/', helper.verifyToken, entry.create);
router.get('/:id', helper.verifyToken, entry.findOne);

router.patch('/:id', helper.verifyToken, entry.update);
router.delete('/:id', helper.verifyToken, entry.delete);

export default router;
