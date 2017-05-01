import mongoose from 'mongoose'

const robotMediaSchema = mongoose.Schema({
  openid: { type: String, required: true, index: true },
  current: String,
  next: String,
  expire: Number,
  created_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now }
})
export const RobotMedia = mongoose.model('RobotMedia', robotMediaSchema)
export default exports