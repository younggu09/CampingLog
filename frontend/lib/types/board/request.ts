export interface RequestAddBoard {
  title: string;
  content: string;
  categoryName: string;
  boardImage: string;
  email: string;
}

export interface RequestAddComment {
  content: string;
  boardId: string;
  email: string;
}

export interface RequestAddLike {
  email: string;
}

export interface RequestSetBoard {
  title: string;
  content: string;
  categoryName: string;
  boardImage: string;
  email: string;
  boardId: string;
}
export interface RequestSetComment {
  commentId: string;
  boardId: string;
  content: string;
}
