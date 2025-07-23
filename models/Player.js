import mongoose from 'mongoose';
const PlayerSchema = new mongoose.Schema({
  fullName: String,
  birthYear: Number,
  parentPhone: String,
  notes: String,
  subscriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' }],
  uniform: { type: mongoose.Schema.Types.ObjectId, ref: 'Uniform' },
  registration: { type: mongoose.Schema.Types.ObjectId, ref: 'Registration' }
}, { timestamps: true });
export default mongoose.model('Player', PlayerSchema);