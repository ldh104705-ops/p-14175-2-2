"use client";

import { apiFetch } from "@/lib/backend/client";
import type { PostDto } from "@/types/post";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page() {
  const [posts, setPosts] = useState<PostDto[] | null>(null);

  useEffect(() => {
    apiFetch("/api/v1/posts").then(setPosts);
  }, []);

  return (
    <>
      <h1>글 목록</h1>

      {posts == null && <div>로딩중...</div>}

      {posts != null && posts.length == 0 && <div>글이 없습니다.</div>}

      {posts != null && posts.length > 0 && (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <Link href={`/posts/${post.id}`}>
                {post.id} : {post.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
