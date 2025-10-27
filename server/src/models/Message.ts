import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  from: mongoose.Types.ObjectId;
  to: mongoose.Types.ObjectId;
  content: string;
  isRead: boolean;
  relatedInfluencer?: mongoose.Types.ObjectId;
  collaborationRequest?: boolean;
}

const MessageSchema = new Schema<IMessage>(
  {
    from: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    to: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    relatedInfluencer: { type: Schema.Types.ObjectId, ref: 'User' },
    collaborationRequest: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IMessage>('Message', MessageSchema);

