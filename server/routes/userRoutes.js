    import express from "express";
    import { deleteUser, getAllUsers, getFavorites, getUserBookings, updateFavorite } from "../controllers/userController.js";
import { protectAdmin } from "../middleware/auth.js";

    const userRouter = express.Router();

    userRouter.get('/bookings', getUserBookings);
    userRouter.post('/update-favorite', updateFavorite);
    userRouter.get('/favorites', getFavorites);
    userRouter.get("/all-user", getAllUsers);
    userRouter.delete("/delete-user/:id", protectAdmin, deleteUser);
    export default userRouter;
