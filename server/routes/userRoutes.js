    import express from "express";
    import { getAllUsers, getFavorites, getUserBookings, updateFavorite } from "../controllers/userController.js";

    const userRouter = express.Router();

    userRouter.get('/bookings', getUserBookings);
    userRouter.post('/update-favorite', updateFavorite);
    userRouter.get('/favorites', getFavorites);
    userRouter.get("/all-user", getAllUsers);
    export default userRouter;
