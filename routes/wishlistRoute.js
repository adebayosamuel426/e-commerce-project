import { Router } from "express";
import { authorizePermissions } from "../middlewares/authMiddleware.js"
const router = Router();
import { addToWishlist, removeFromWishlist, getAllProductsFromWishlist } from '../controllers/wishlistController.js'

router.route("/").post(addToWishlist).delete(removeFromWishlist).get(getAllProductsFromWishlist);

export default router;