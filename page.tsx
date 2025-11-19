'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Header from './components/Header';
import PostCard from './components/PostCard';
import FeaturedPosts from './components/FeaturedPosts';
import LoadingSpinner from './components/LoadingSpinner';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Home() {
  const [page, setPage] = useState(1);
  const { data, error, isLoading } = useSWR(
    `http://localhost:4000/posts?page=${page}&limit=9`,
    fetcher
  );

  if (error) return <div>Failed to load posts</div>;

  return (
    <div>
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <FeaturedPosts />
        
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-8">Latest Posts</h2>
          
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {data?.posts.map((post: any) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">Page {page}</span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= data?.pagination.pages}
                  className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}