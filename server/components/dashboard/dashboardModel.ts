import { Schema, model } from 'mongoose';

const DashboardSchema = new Schema({
  idChecker: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  lastCache: {
    type: Number,
    default: (): number => Date.now(),
  },
});

export default model('Dashboard', DashboardSchema);
