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
  metricsDate: {
    type: Date,
    default: (): number => Date.now(),
  },
});

export default model('Metric', MetricSchema);

export interface MetricType extends Document {
  ms: number;
  statusCode: number;
  checkerId: string;
  metricsDate: Date;
}

export interface MetricAddDataType {
  ms: number;
  statusCode: number;
  checkerId: string;
}
