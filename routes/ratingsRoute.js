import { Router } from "express";
import { authorizePermissions, authenticateUser } from "../middlewares/authMiddleware.js"
const router = Router();

import { addRatings, getProductRatings, deleteRatings, getAllRatings } from '../controllers/ratingsController.js'

router.route('/:productId').post(authenticateUser, authorizePermissions("customer"), addRatings).get(getProductRatings)

router.route("/").get(authenticateUser, authorizePermissions("admin"), getAllRatings)
router.route('/:id').delete(authenticateUser, deleteRatings);
export default router;