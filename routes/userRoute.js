import { Router } from "express";
import { authorizePermissions } from "../middlewares/authMiddleware.js"
const router = Router();
import { getCurrentUser, getAllUsers, updateCurrentUserProfile, deleteUser, getUser, updateUser, searchUsers, getWeeklyUsers } from '../controllers/userController.js'

router.get("/", authorizePermissions("admin"), getAllUsers);
router.get("/stats", authorizePermissions("admin"), getWeeklyUsers);
router.route("/profile").get(getCurrentUser).patch(updateCurrentUserProfile).delete(deleteUser);
router.get("/search", authorizePermissions("admin"), searchUsers);
router.route('/:id').delete(authorizePermissions("admin"), deleteUser).get(authorizePermissions("admin"), getUser).patch(authorizePermissions("admin"), updateUser);


export default router;