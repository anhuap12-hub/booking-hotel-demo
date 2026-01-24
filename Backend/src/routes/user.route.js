import express from 'express'
import { 
  updateProfile, 
  updatePhone 
} from '../controllers/user.controller.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// Route lấy thông tin cá nhân của chính mình
router.get('/profile', protect, (req, res) => {
    res.json({ 
      message: "Profile fetched successfully", 
      user: req.user 
    })
})

// Route tự cập nhật profile
router.put('/profile', protect, updateProfile)

// Route cập nhật số điện thoại
router.put('/update-phone', protect, updatePhone)

export default router;