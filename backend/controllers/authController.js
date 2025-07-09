// controllers/authController.js

import User from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' })
    }

    const newUser = new User({ fullName, email, password, role })
    await newUser.save()

    // Générer le token JWT après inscription
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.status(201).json({ 
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Registration error', error: error.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Générer le token JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Login error', error: error.message })
  }
}

export const logout = (req, res) => {
  try {
    // Pour une déconnexion côté client, on peut simplement retourner un succès
    // Le client devra supprimer le token localement
    res.status(200).json({ message: 'Logout successful' })
  } catch (error) {
    res.status(500).json({ message: 'Logout error', error: error.message })
  }
}

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password')
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    res.status(200).json({ user })
  } catch (error) {
    res.status(500).json({ message: 'Profile error', error: error.message })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const { fullName, email } = req.body
    const userId = req.user.userId

    // Vérifier si l'email existe déjà pour un autre utilisateur
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } })
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' })
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fullName, email },
      { new: true, runValidators: true }
    ).select('-password')

    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser
    })
  } catch (error) {
    res.status(500).json({ message: 'Update error', error: error.message })
  }
}
