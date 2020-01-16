import { Schema, model } from 'mongoose';

const GroupSchema = new Schema({
  name: {
    type: Number,
    required: true,
  },
  description: {
    type: String
  },
});

export default model('Group', GroupSchema);
