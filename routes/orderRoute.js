import { Router } from "express";
import { authorizePermissions, authenticateUser } from "../middlewares/authMiddleware.js"
const router = Router();
import {
    createOrder,
    getAllOrders,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
    getUserOrdersById,
    updatePaymentStatus,
    getWeeklySales

} from '../controllers/orderController.js';

router.route('/').post(authorizePermissions("customer"), createOrder).get(authorizePermissions("admin"), getAllOrders);
router.route('/user').get(getUserOrders);
router.route('/stats').get(authorizePermissions("admin"), getWeeklySales);
router.route('/user/:id').get(authorizePermissions("admin"), getUserOrdersById);
router.route('/:id').patch(authorizePermissions("admin"), updateOrderStatus).get(getOrderById);
router.route('/payment/:id').patch(updatePaymentStatus);
export default router;