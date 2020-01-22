import { Schema, model } from 'mongoose';

const MetricSchema = new Schema({
  ms: {
    type: Number,
    required: true,
  },
  statusCode: {
    type: Number,
    required: true,
  },
  checkerId: {
    type: Schema.Types.ObjectId,
    ref: 'Checker',
    required: true,
  },
  date: {
    type: Date,
    default: (): number => Date.now(),
  },
});

export default model('Metric', MetricSchema);
