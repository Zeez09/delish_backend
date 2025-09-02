import express from "express";
import { placeOrder, fetchCert,updateOrderStatus } from "../controller/foodController.js";

const router = express.Router();


router.post ("/", placeOrder);
router.get("/", fetchCert);                 
router.put("/:orderId/status", updateOrderStatus); 


export default router;
