import mongoose from 'mongoose';
const SubscriptionSchema = new mongoose.Schema({
  player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  month: String,
  hasPaid: Boolean,
  paymentDate: Date,
  amount: Number
}, { timestamps: true });
export default mongoose.model('Subscription', SubscriptionSchema);