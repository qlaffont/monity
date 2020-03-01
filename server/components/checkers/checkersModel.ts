import { Schema, model } from 'mongoose';

const CheckerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  checkerType: {
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
  cron: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
  groupId: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
    required: true,
  },
});

export default model('Checker', CheckerSchema);

enum CheckerTypeEnum {
  PING = 'ping',
  HTTP = 'http',
}

export interface CheckerType extends Document {
  name: string;
  description?: string;
  checkerType: CheckerTypeEnum;
  address: string;
  port?: number;
  cron: string;
  active?: boolean;
  groupId: string;
}

export interface CheckerAddDataType {
  name: string;
  description?: string;
  checkerType: CheckerTypeEnum;
  address: string;
  port?: number;
  cron: string;
  groupId: string;
}

export interface CheckerEditDataType {
  name?: string;
  description?: string;
  address?: string;
  port?: number;
  cron?: string;
}
