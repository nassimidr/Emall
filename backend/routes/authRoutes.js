// routes/auth.js
import express from "express"
import { register, login, logout, getProfile, updateProfile } from "../controllers/authController.js"
import { auth } from "../middleware/auth.js"
import { validateRegister, validateLogin, validateProfileUpdate } from "../middleware/validation.js"

const router = express.Router()

router.post("/register", validateRegister, register)
router.post("/login", validateLogin, login)
router.post("/logout", logout)
router.get("/profile", auth, getProfile)
router.put("/profile", auth, validateProfileUpdate, updateProfile)

export default router
