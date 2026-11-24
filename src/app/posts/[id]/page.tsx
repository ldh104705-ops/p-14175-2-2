"use client";

import { apiFetch } from "@/lib/backend/client";
import type { PostCommentDto, PostDto } from "@/types/post";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// 댓글 작성 폼만 담당
function PostCommentWrite({
  postCommentsState,
}: {
  postCommentsState: ReturnType<typeof usePostComments>;
}) {
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

    postCommentsState.writeComment(contentTextarea.value, (data) => {
      alert(data.msg);
      contentTextarea.value = "";
    });
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
    </>
  );
}

// 댓글 한 줄(li)만 담당
function PostCommentListItem({
  comment,
  postCommentsState,
}: {
  comment: PostCommentDto;
  postCommentsState: ReturnType<typeof usePostComments>;
}) {
  // 수정모드 여부. 댓글마다 컴포넌트가 따로라서 각 댓글이 자기 상태를 따로 가짐
  const [modifyMode, setModifyMode] = useState(false);

  // true ↔ false 뒤집기
  const toggleModifyMode = () => {
    setModifyMode(!modifyMode);
  };

  const handleModifyFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // 일단 전송(페이지 새로고침)만 막아둠, 실제 수정은 다음 단계에서
    e.preventDefault();
  };

  // 훅의 deleteComment를 이 컴포넌트에 맞게 '재정의'
  // → 이제 댓글 하나만 다루니까 commentId도 받을 필요 없음
  const deleteComment = () => {
    if (!confirm(`${comment.id}번 댓글을 정말로 삭제하시겠습니까?`)) return;

    postCommentsState.deleteComment(comment.id, (data) => alert(data.msg));
  };

  return (
    <li className="flex gap-2 items-start">
      <span>{comment.id} : </span>
      {!modifyMode && <span>{comment.content}</span>}
      {modifyMode && (
        <form className="flex gap-2" onSubmit={handleModifyFormSubmit}>
          <input
            className="border p-1 rounded"
            type="text"
            name="content"
            placeholder="댓글 내용"
            maxLength={100}
            defaultValue={comment.content}
            autoFocus
          />
          <button className="px-1 rounded border" type="submit">
            저장
          </button>
        </form>
      )}
      <button className="px-1 rounded border" onClick={toggleModifyMode}>
        {modifyMode ? "수정취소" : "수정"}
      </button>
      <button className="px-1 rounded border" onClick={deleteComment}>
        삭제
      </button>
    </li>
  );
}

// 댓글 목록만 담당
function PostCommentList({
  postCommentsState,
}: {
  postCommentsState: ReturnType<typeof usePostComments>;
}) {
  const { postId, postComments } = postCommentsState;

  return (
    <>
      <h2>{postId}번 글의 댓글 목록</h2>

      {postComments == null && <div>댓글 로딩중...</div>}

      {postComments != null && postComments.length == 0 && (
        <div>댓글이 없습니다.</div>
      )}

      {postComments != null && postComments.length > 0 && (
        <ul>
          {postComments.map((comment) => (
            // key는 map으로 반복되는 바깥쪽 요소(여기선 컴포넌트)에 붙여야 함
            <PostCommentListItem
              key={comment.id}
              comment={comment}
              postCommentsState={postCommentsState}
            />
          ))}
        </ul>
      )}
    </>
  );
}

// 이제 작성 + 목록 컴포넌트를 '조립'만 함
function PostCommentWriteAndList({
  postCommentsState,
}: {
  // ReturnType<typeof 함수> : 그 함수가 리턴하는 값의 타입을 자동으로 뽑아냄
  postCommentsState: ReturnType<typeof usePostComments>;
}) {
  return (
    <>
      <PostCommentWrite postCommentsState={postCommentsState} />

      <PostCommentList postCommentsState={postCommentsState} />
    </>
  );
}

function PostInfo({
  postState,
}: {
  postState: ReturnType<typeof usePost>;
}) {
  const router = useRouter();
  const { post } = postState;

  if (post == null) return <div>로딩중...</div>;

  // 훅의 deletePost를 이 컴포넌트에 맞게 '재정의' → JSX가 짧아짐
  const deletePost = () => {
    if (!confirm(`${post.id}번 글을 정말로 삭제하시겠습니까?`)) return;

    postState.deletePost((data) => {
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
        <button className="p-2 rounded border" onClick={deletePost}>
          삭제
        </button>
        <Link className="p-2 rounded border" href={`/posts/${post.id}/edit`}>
          수정
        </Link>
      </div>
    </>
  );
}

// 커스텀 훅: use로 시작하는 함수. 화면(JSX) 없이 '글 데이터 로직'만 담당
function usePost(id: number) {
  const [post, setPost] = useState<PostDto | null>(null);

  useEffect(() => {
    apiFetch(`/api/v1/posts/${id}`).then(setPost);
  }, [id]);

  // 데이터 로직(API 호출)만 하고, 성공 후 화면 처리(alert, 이동)는 onSuccess로 호출한 쪽에 맡김
  // id를 매개변수로 받지 않아도 됨 → usePost(id)의 id를 기억하고 있음 (클로저)
  const deletePost = (onSuccess: (data: { msg: string }) => void) => {
    apiFetch(`/api/v1/posts/${id}`, {
      method: "DELETE",
    }).then(onSuccess);
  };

  return {
    post,
    deletePost,
  };
}

// 댓글 데이터 로직(state + 조회/작성/삭제 API)만 담당하는 커스텀 훅
// 댓글 입장에서 그냥 id라고 하면 '댓글 id'인지 '글 id'인지 헷갈림 → postId로 명확하게
function usePostComments(postId: number) {
  const [postComments, setPostComments] = useState<PostCommentDto[] | null>(
    null,
  );

  useEffect(() => {
    apiFetch(`/api/v1/posts/${postId}/comments`).then(setPostComments);
  }, [postId]);

  // 아래 두 함수도 postId를 따로 받지 않음 → usePostComments(postId)의 postId를 기억 (클로저)
  const deleteComment = (
    commentId: number,
    onSuccess: (data: { msg: string }) => void,
  ) => {
    apiFetch(`/api/v1/posts/${postId}/comments/${commentId}`, {
      method: "DELETE",
    }).then((data) => {
      if (postComments != null) {
        // 삭제된 댓글만 빼고 새 배열을 만들어 state 교체 → 화면에서도 바로 사라짐
        setPostComments(
          postComments.filter((comment) => comment.id != commentId),
        );
      }

      onSuccess(data);
    });
  };

  const writeComment = (
    content: string,
    onSuccess: (data: { msg: string }) => void,
  ) => {
    apiFetch(`/api/v1/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify({ content }),
    })
      .then((data) => {
        if (postComments != null) {
          // 응답으로 받은 새 댓글(data.data)을 맨 앞에 붙인 새 배열로 교체
          setPostComments([data.data, ...postComments]);
        }

        onSuccess(data);
      })
      // apiFetch가 4xx, 5xx 응답이면 rsData를 던짐 → 여기서 받아서 메시지 출력
      .catch((rsData) => {
        alert(`${rsData.resultCode} : ${rsData.msg}`);
      });
  };

  return {
    postId, // 하위 컴포넌트에서 글 id가 필요하면 props 대신 여기서 꺼내 쓰면 됨
    postComments,
    deleteComment,
    writeComment,
  };
}

export default function Page() {
  // path 파라미터는 항상 문자열("1")로만 가져올 수 있음 → 숫자로 변환해서 사용
  // { id: idStr } : params.id 값을 idStr 이라는 이름의 변수에 담음 (구조분해할당 + 이름 변경)
  const { id: idStr } = useParams<{ id: string }>();
  const id = parseInt(idStr);

  // 훅의 결과를 쪼개지(구조분해) 않고 통째로 받아서 하위 컴포넌트에 그대로 넘김
  const postState = usePost(id);
  const postCommentsState = usePostComments(id);

  return (
    <>
      <h1>글 상세페이지</h1>

      <PostInfo postState={postState} />

      <PostCommentWriteAndList postCommentsState={postCommentsState} />
    </>
  );
}
