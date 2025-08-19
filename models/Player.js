import mongoose from 'mongoose';
const PlayerSchema = new mongoose.Schema({
  fullName: {type: String, required: true},
  birthYear: {type: Number, required: true},
  parentPhone: { type: Number, required: true },
  notes: {type: String, required: true},
  subscriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' }],
  uniform: { type: mongoose.Schema.Types.ObjectId, ref: 'Uniform' },
  registration: { type: mongoose.Schema.Types.ObjectId, ref: 'Registration' }

}, { timestamps: true });
export default mongoose.model('Player', PlayerSchema);