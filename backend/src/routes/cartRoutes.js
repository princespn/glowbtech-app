import express from 'express';
import { addToCart , getUserCart} from '../controllers/CartController.js';

const router = express.Router();
router.post('/add', addToCart);
router.get('/:user_id', getUserCart);


export default router;