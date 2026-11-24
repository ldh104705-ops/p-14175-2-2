"use client";

import { apiFetch } from "@/lib/backend/client";
import type { PostCommentDto, PostDto } from "@/types/post";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function PostCommentWriteAndList({
  id,
  postComments,
  setPostComments,
}: {
  id: number;
  postComments: PostCommentDto[] | null;
  setPostComments: (postComments: PostCommentDto[]) => void;
}) {
  const deleteComment = (id: number, commentId: number) => {
    apiFetch(`/api/v1/posts/${id}/comments/${commentId}`, {
      method: "DELETE",
    }).then((data) => {
      alert(data.msg);

      if (postComments == null) return;

      // 삭제된 댓글만 빼고 새 배열을 만들어 state 교체 → 화면에서도 바로 사라짐
      setPostComments(
        postComments.filter((comment) => comment.id != commentId),
      );
    });
  };

  const writeComment = (id: number, content: string) => {
    apiFetch(`/api/v1/posts/${id}/comments`, {
      method: "POST",
      body: JSON.stringify({ content }),
    })
      .then((data) => {
        alert(data.msg);

        if (postComments == null) return;

        // 응답으로 받은 새 댓글(data.data)을 맨 앞에 붙인 새 배열로 교체
        setPostComments([data.data, ...postComments]);
      })
      // apiFetch가 4xx, 5xx 응답이면 rsData를 던짐 → 여기서 받아서 메시지 출력
      .catch((rsData) => {
        alert(`${rsData.resultCode} : ${rsData.msg}`);
      });
  };

  const handleCommentWriteFormSubmit = (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const contentTextarea = form.elements.namedItem(
      "content",
    ) as HTMLTextAreaElement;

    contentTextarea.value = contentTextarea.value.trim();

    if (contentTextarea.value.length == 0) {
      alert("댓글 내용을 입력해주세요.");
      contentTextarea.focus();
      return;
    }

    if (contentTextarea.value.length < 2) {
      alert("댓글 내용을 2자 이상 입력해주세요.");
      contentTextarea.focus();
      return;
    }

    if (contentTextarea.value.length > 100) {
      alert("댓글 내용은 100자 이하로 입력해주세요.");
      contentTextarea.focus();
      return;
    }

    writeComment(id, contentTextarea.value);
    contentTextarea.value = "";
  };

  return (
    <>
      <h2>댓글 작성</h2>

      <form
        className="flex flex-col gap-2 p-2"
        onSubmit={handleCommentWriteFormSubmit}
      >
        <textarea
          className="border p-2 rounded"
          name="content"
          placeholder="댓글 내용"
          maxLength={100}
          rows={3}
        />
        <button className="border p-2 rounded" type="submit">
          작성
        </button>
      </form>

      <h2>댓글 목록</h2>

      {postComments == null && <div>댓글 로딩중...</div>}

      {postComments != null && postComments.length == 0 && (
        <div>댓글이 없습니다.</div>
      )}

      {postComments != null && postComments.length > 0 && (
        <ul>
          {postComments.map((comment) => (
            <li key={comment.id} className="flex gap-2 items-start">
              <span>
                {comment.id} : {comment.content}
              </span>
              <button
                className="px-1 rounded border"
                onClick={() =>
                  confirm(`${comment.id}번 댓글을 정말로 삭제하시겠습니까?`) &&
                  deleteComment(id, comment.id)
                }
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function PostInfo({ post }: { post: PostDto }) {
  const router = useRouter();

  const deletePost = (id: number) => {
    apiFetch(`/api/v1/posts/${id}`, {
      method: "DELETE",
    }).then((data) => {
      alert(data.msg);
      router.replace("/posts");
    });
  };

  return (
    <>
      <div>번호 : {post.id}</div>
      <div>제목 : {post.title}</div>
      <div style={{ whiteSpace: "pre-line" }}>{post.content}</div>

      <div className="flex gap-2">
        <button
          className="p-2 rounded border"
          onClick={() => confirm(`${post.id}번 글을 정말로 삭제하시겠습니까?`) && deletePost(post.id)}
        >
          삭제
        </button>
        <Link className="p-2 rounded border" href={`/posts/${post.id}/edit`}>
          수정
        </Link>
      </div>
    </>
  );
}

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<PostDto | null>(null);
  const [postComments, setPostComments] = useState<PostCommentDto[] | null>(
    null,
  );

  useEffect(() => {
    apiFetch(`/api/v1/posts/${id}`).then(setPost);
    apiFetch(`/api/v1/posts/${id}/comments`).then(setPostComments);
  }, [id]);

  if (post == null) return <div>로딩중...</div>;

  return (
    <>
      <h1>글 상세페이지</h1>

      <PostInfo post={post} />

      <PostCommentWriteAndList
        id={post.id}
        postComments={postComments}
        setPostComments={setPostComments}
      />
    </>
  );
}
