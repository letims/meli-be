/** src/routes/user.ts */
import express from 'express';
import controller from '../controllers/user';
const router = express.Router();

router.get('/user', controller.getUser);
router.get('/user/:id/purchases/:limit?/:page?', controller.getUserPurchases);

export = router;