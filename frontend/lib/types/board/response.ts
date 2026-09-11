export interface ResponseGetBoardByCategory {
  boardId: string;
  title: string;
  content: string;
  categoryName: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  boardImage: string;
  createdAt: string;
}

export interface ResponseGetBoardRank {
  boardId: string;
  boardImage: string;
  title: string;
  nickname: string;
  rank: number;
  viewCount: number;
}

export interface ResponseGetBoardByKeyword {
  boardId: string;
  title: string;
  content: string;
  categoryName: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  boardImage: string;
  createdAt: string;
}

export interface ResponseGetComments {
  commentId: string;
  content: string;
  nickname: string;
  createdAt: string;
  email: string;
}

export interface ResponseGetLike {
  boardId: string;
  likeCount: number;
}

export interface ResponseGetBoardByCategoryWrapper {
  content: ResponseGetBoardByCategory[];
  totalPages: number;
  totalElements: number;
  pageNumber: number;
  pageSize: number;
  isFirst: boolean;
  isLast: boolean;
}

export interface ResponseGetBoardDetail {
  boardId: string;
  title: string;
  content: string;
  categoryName: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  boardImage: string;
  createdAt: string;
  nickname: string;
  email: string;
  isLiked: boolean;
  comments: ResponseGetComments[];
}

export interface ResponseGetCommentWrapper {
  content: ResponseGetComments[];
  totalPages: number;
  totalComments: number;
  pageNumber: number;
  pageSize: number;
  isFirst: boolean;
  isLast: boolean;
}

export interface ResponseGetBoardByKeywordWrapper {
  content: ResponseGetBoardByKeyword[];
  totalPages: number;
  totalElements: number;
  pageNumber: number;
  pageSize: number;
  isFirst: boolean;
  isLast: boolean;
}

export interface BoardListItemType {
  boardId: number;
  title: string;
  content: string;
  categoryName: string;
  createdAt: string;
  viewCount: number;
  commentCount: number;
  likeCount: number;
}

export interface ResponseToggleLike {
  liked: boolean;
  likeCount: number;
}
