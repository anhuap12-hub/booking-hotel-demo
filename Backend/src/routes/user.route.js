import express from 'express'
import { updateProfile, getUserById, deleteUser, updateUserByAdmin } from '../controllers/user.controller.js'
import { protect } from '../middleware/auth.js'
import {getAllUsers} from '../controllers/user.controller.js'
import { adminOnly } from '../middleware/role.js'
import { updateUserRole } from '../controllers/user.controller.js'

const router = express.Router()
//public

router.put('/profile', protect, updateProfile)
router.get('/profile', protect, async (req, res, next) => {
    try {
        res.json({ message: "Profile fetched successfully", user: req.user })
    } catch (error) {
        next(error)
    }
})
//admin
router.put('/:id', protect, adminOnly, updateUserByAdmin)
router.get('/', protect, adminOnly, getAllUsers)
router.get('/:id', protect, adminOnly, getUserById)
router.delete('/:id', protect, adminOnly, deleteUser)
router.put('/:id/role', protect, adminOnly, updateUserRole)
export default router;
