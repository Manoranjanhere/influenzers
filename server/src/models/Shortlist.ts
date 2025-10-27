import mongoose, { Schema, Document } from 'mongoose';

export interface IShortlist extends Document {
  brandId: mongoose.Types.ObjectId;
  influencerId: mongoose.Types.ObjectId;
  notes?: string;
}

const ShortlistSchema = new Schema<IShortlist>(
  {
    brandId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    influencerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    notes: String,
  },
  { timestamps: true }
);

ShortlistSchema.index({ brandId: 1, influencerId: 1 }, { unique: true });

export default mongoose.model<IShortlist>('Shortlist', ShortlistSchema);

