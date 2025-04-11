import { Router } from "express";
import { authorizePermissions, authenticateUser } from "../middlewares/authMiddleware.js"
const router = Router();
import { upload } from "../middlewares/uploadMiddleware.js";
import { addProduct, updateProductDetails, deleteProduct, getAllProducts, getProductById, searchProducts } from '../controllers/ProductController.js'

router.route('/').post(authenticateUser, authorizePermissions("admin"), upload.single('image'), addProduct).get(getAllProducts);



router.get('/search', searchProducts)
router.route('/:id').patch(authenticateUser, authorizePermissions("admin"), upload.single('image'), updateProductDetails).delete(authenticateUser, authorizePermissions("admin"), deleteProduct).get(authenticateUser, getProductById);
export default router;