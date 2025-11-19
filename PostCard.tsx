import Link from 'next/link';
import Image from 'next/image';

interface PostCardProps {
  post: {
    _id: string;
    title: string;
    excerpt: string;
    featuredImage?: string;
    slug: string;
    author: {
      name: string;
    };
    createdAt: string;
    views: number;
  };
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {post.featuredImage && (
        <div className="relative h-48">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-3">
          <Link 
            href={`/posts/${post.slug}`}
            className="hover:text-blue-600 transition-colors"
          >
            {post.title}
          </Link>
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>By {post.author.name}</span>
          <div className="flex space-x-4">
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            <span>{post.views} views</span>
          </div>
        </div>
      </div>
    </article>
  );
}