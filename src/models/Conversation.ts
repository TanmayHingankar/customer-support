import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';

export type MessageRecord = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

export interface IConversation extends Document {
  userId: Types.ObjectId;
  messages: MessageRecord[];
  rating: number | null;
  title: string;
  createdAt: Date;
}

const MessageSchema = new Schema<MessageRecord>({
  role: { type: String, required: true, enum: ['user', 'assistant'] },
  content: { type: String, required: true },
  timestamp: { type: Date, default: () => new Date() },
});

const ConversationSchema = new Schema<IConversation>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  messages: { type: [MessageSchema], default: [] },
  rating: { type: Number, default: null },
  title: { type: String, default: '' },
  createdAt: { type: Date, default: () => new Date() },
});

ConversationSchema.index({ userId: 1, createdAt: -1 });

ConversationSchema.pre('save', function (next) {
  if (!this.title && this.messages.length > 0) {
    const firstUserMessage = this.messages.find((item) => item.role === 'user');
    if (firstUserMessage) {
      this.title = firstUserMessage.content.slice(0, 50).trim();
    }
  }
  next();
});

const Conversation = (mongoose.models.Conversation as Model<IConversation>) || mongoose.model<IConversation>('Conversation', ConversationSchema);

export async function getConversationModel() {
  await connectToDatabase();
  return Conversation;
}

export default Conversation;
