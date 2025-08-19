import mongoose from 'mongoose';
const RegistrationSchema = new mongoose.Schema({
  player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  hasPaid: Boolean,
  hasSubmittedDocs: Boolean,
  amount: Number,
  paymentDate: { type: Date, default: null }
}, { timestamps: true });
export default mongoose.model('Registration', RegistrationSchema);