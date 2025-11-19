import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10, search } = paginationDto;
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const posts = await this.postModel
      .find(query)
      .populate('author', 'name email')
      .populate('categories', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await this.postModel.countDocuments(query);

    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const post = await this.postModel
      .findById(id)
      .populate('author', 'name email')
      .populate('categories', 'name slug')
      .exec();

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Увеличиваем счетчик просмотров
    await this.postModel.findByIdAndUpdate(id, { $inc: { views: 1 } });

    return post;
  }

  async findBySlug(slug: string) {
    const post = await this.postModel
      .findOne({ slug })
      .populate('author', 'name email')
      .populate('categories', 'name slug')
      .exec();

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    await this.postModel.findOneAndUpdate({ slug }, { $inc: { views: 1 } });

    return post;
  }

  async findFeatured() {
    return this.postModel
      .find({ featured: true, status: 'published' })
      .populate('author', 'name email')
      .populate('categories', 'name slug')
      .sort({ createdAt: -1 })
      .limit(5)
      .exec();
  }

  async create(createPostDto: CreatePostDto) {
    const slug = await this.generateSlug(createPostDto.title);
    const createdPost = new this.postModel({
      ...createPostDto,
      slug,
    });
    return createdPost.save();
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const existingPost = await this.postModel.findByIdAndUpdate(
      id,
      updatePostDto,
      { new: true },
    );

    if (!existingPost) {
      throw new NotFoundException('Post not found');
    }

    return existingPost;
  }

  async remove(id: string) {
    const result = await this.postModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('Post not found');
    }
    return result;
  }

  private async generateSlug(title: string): Promise<string> {
    let slug = title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    let existingPost = await this.postModel.findOne({ slug });
    let counter = 1;

    while (existingPost) {
      slug = `${slug}-${counter}`;
      existingPost = await this.postModel.findOne({ slug });
      counter++;
    }

    return slug;
  }
}