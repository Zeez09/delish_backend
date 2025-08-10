import express from "express";
import { signUp, logIn } from "../controller/userController.js";
import { placeOrder } from "../controller/foodController.js";





const router = express.Router();

router.post ("/signup", signUp);
router.post ("/login", logIn);
router.post ("/", placeOrder);



export default router;