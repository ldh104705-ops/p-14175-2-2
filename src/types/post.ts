// 백엔드 PostDto.java 와 같은 모양
export type PostDto = {
  id: number;
  createDate: string;
  modifyDate: string;
  title: string;
  content: string;
};

// 백엔드 PostCommentDto.java 와 같은 모양
export type PostCommentDto = {
  id: number;
  createDate: string;
  modifyDate: string;
  content: string;
};
