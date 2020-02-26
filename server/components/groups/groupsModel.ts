import { Schema, model, Document } from 'mongoose';

const GroupSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

export default model('Group', GroupSchema);

export interface GroupType extends Document {
  name: string;
  description?: string;
}
