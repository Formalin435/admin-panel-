import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  excerpt: string;

  @Prop()
  featuredImage: string;

  @Prop({ default: 'draft' })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId;

  @Prop([{ type: Types.ObjectId, ref: 'Category' }])
  categories: Types.ObjectId[];

  @Prop({ default: 0 })
  views: number;

  @Prop()
  slug: string;

  @Prop({ default: false })
  featured: boolean;
}

export const PostSchema = SchemaFactory.createForClass(Post);