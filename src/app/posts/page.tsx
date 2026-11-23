"use client";

import type { PostDto } from "@/types/post";
import { useEffect, useState } from "react";

export default function Page() {
  const [posts, setPosts] = useState<PostDto[] | null>(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/posts")
      .then((res) => res.json())
      .then(setPosts);
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
              {post.id} : {post.title}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
