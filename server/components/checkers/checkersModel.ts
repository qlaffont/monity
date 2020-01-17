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
  active: {
    type: Boolean,
    default: false,
  },
  checkerId: {
    type: Schema.Types.ObjectId,
    ref: 'Checker',
  },
});

export default model('Checker', CheckerSchema);
