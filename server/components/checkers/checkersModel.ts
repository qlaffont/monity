import { Schema, model } from 'mongoose';

const CheckerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  type: {
    type: String,
    required: true,
    enum: ['ping', 'http'],
  },
  address: {
    type: String,
    required: true,
  },
  port: {
    type: Number,
  },
  active: {
    type: Boolean,
    default: false,
  },
  groupId: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
  },
});

export default model('Checker', CheckerSchema);
