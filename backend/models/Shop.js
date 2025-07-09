import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema({
  name: String,
  mallId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mall',
    required: true
  },
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
  }
});

export default mongoose.model('Shop', shopSchema);
