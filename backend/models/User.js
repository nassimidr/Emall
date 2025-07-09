import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    minlength: 2,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  }
}, { timestamps: true })

// 🔐 Hachage du mot de passe avant enregistrement
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (err) {
    next(err)
  }
})

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

// Méthode pour obtenir les données publiques de l'utilisateur
userSchema.methods.toPublicJSON = function() {
  const userObject = this.toObject()
  delete userObject.password
  return userObject
}

const User = mongoose.model('User', userSchema)
export default User
