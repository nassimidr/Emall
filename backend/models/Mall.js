import mongoose from 'mongoose'

const mallSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  fullDescription: String,
  image: String,
  images: [String],
  location: String,
  address: String,
  phone: String,
  email: String,
  website: String,
  rating: Number,
  totalReviews: Number,
  tags: [String],
  hours: {
    type: Map,
    of: String
  },
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Mall = mongoose.model('Mall', mallSchema)

export default Mall
