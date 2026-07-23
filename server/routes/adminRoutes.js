import express from "express";
import { adminLogin, registerAdmin } from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.post("/register", registerAdmin); 
adminRouter.post("/login", adminLogin);

export default adminRouter;