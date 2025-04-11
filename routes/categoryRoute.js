import { Router } from "express";
import { authorizePermissions, authenticateUser } from "../middlewares/authMiddleware.js"
const router = Router();
import { addCategory, updateCategory, deleteCategory, getAllCategories, getCategoryProductsById, getCategoryById } from '../controllers/categoryController.js'

router.route('/').post(authenticateUser, authorizePermissions("admin"), addCategory).get(getAllCategories);


router.route('/:id').patch(authenticateUser, authorizePermissions("admin"), updateCategory).delete(authenticateUser, authorizePermissions("admin"), deleteCategory).get(getCategoryById);

router.get('/:id/products', getCategoryProductsById)
export default router;