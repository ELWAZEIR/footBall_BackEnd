import mongoose from 'mongoose';
const UniformSchema = new mongoose.Schema({
  player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  hasPaid: Boolean,
  hasReceived: Boolean,
  size: String,
  amount: Number
}, { timestamps: true });
export default mongoose.model('Uniform', UniformSchema);