import express from 'express'
import { 
  updateProfile, 
  updatePhone 
} from '../controllers/user.controller.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()


router.get('/profile', protect, (req, res) => {
    res.json({ 
      message: "Profile fetched successfully", 
      user: req.user 
    })
})
router.put('/profile', protect, updateProfile)
router.put('/update-phone', protect, updatePhone)

export default router;