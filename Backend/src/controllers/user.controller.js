import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

export const updateProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
        if (!user) return res.status(404).json({ message: "User not found" })

        user.username = req.body.username || user.username
        user.email = req.body.email || user.email

        const updated = await user.save()
        res.json({
            message: "Profile updated",
            user: {
                _id: updated._id,
                username: updated.username,
                email: updated.email,
                role: updated.role
            }
        })
    } catch (error) {
        if (error.code === 11000 && error.keyPattern.email) {
            return res.status(400).json({ message: "Email already in use" })
        }
        next(error)
    }
}

export const getAllUsers = async (req, res) =>{
  try{
    const users = await User.find().select('-password')
    res.json(users)
  }catch(error){ 
      res.status(500).json({ message: error.message })
  }
  }

  export const getUserById = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user id' })
    }

    const user = await User.findById(id).select('-password')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json(user)

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid user id' })
  }
  const user = await User.findById(id)
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }
  await user.deleteOne()
  res.json({ message: 'User deleted' })
  } catch (error) {
    console.error('deleteUser eroor:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const updateUserRole = async  (req, res) =>{
  try{
    const {id} = req.params
    const {role} = req.body

    if(req.user._id.toString() === id){
      return res.status(403).json ({
        message: 'You cannot update your own role '
      })
    }
    if(!['user', 'admin'].includes(role)){
      return res.status(400).json({ message: 'Invalid role' })
    }
    const user = await User.findById(id)
    if(!user){
      return res.status(404).json({ message: 'User not found' })
    }
    user.role = role 
    await user.save()

    res.json({
      message: 'Role updated',
      user:{
        _id: user._id,
        email: user.email,
        role: user.role
      }
    })
  } catch (error){
      console.log('updateUserRole error:', error)
      res.status(500).json({ message: 'Server error' })
    }
  }

  export const updateUserByAdmin = async (req, res) =>{
    try{
      const {id} = req.params;
      const {username, email } = req.body;
    const user = await User.findById(id);
  if(!user) return res.status(404).json({ message: 'User not found' });
  user.username = username || user.username;
  user.email = email || user.email;
  
  await user.save();
  res.json({
    message: 'User updated',
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    }
  });
    }catch(error){
      res.status(500).json({ message: 'Server error' })
    }
  }

  export const updatePhone = async (req, res) => {
  const { phone } = req.body;

  const user = await User.findById(req.user.id);
  user.phone = phone;
  user.phoneVerified = false;
  await user.save();

  res.json({ message: "Phone updated, please verify later" });
};