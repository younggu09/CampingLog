export interface ResponseGetRanking {
  nickname: string;
  memberGrade: MemberGrade;
  profileImage: string | null;
  totalLikes: number;
}

// 회원 기본 정보 (GET /api/members/mypage)
export interface ResponseGetMember {
  email: string;
  name: string;
  nickname: string;
  birthday: string;
  phoneNumber: string;
  profileImage?: string;
  memberGrade : MemberGrade;
  joinDate: string;
}

// 프로필 이미지 (GET /api/members/mypage/profile-image)
export interface ResponseGetMemberProfileImage {
  profileImage: string;
}

// 활동 요약 (GET /api/members/mypage/summary)
export interface ResponseGetMemberActivitySummary {
  boardCount: number;
  commentCount: number;
  reviewCount: number;
  likeCount: number;
}

export interface ResponseGetMemberBoards {
    title: string;
    content: string;
    boardImage: string;
    createdAt: string;
    boardId: string;
}

export interface Member {
  email: string;
  name: string;
  nickname: string;
  birthday: string;
  phoneNumber: string;
  role: string;
  profileImage?: string;
}

export interface ActivitySummary {
  totalBoards: number;
  totalLikes: number;
  totalComments: number;
}

export interface ResponseGetMemberComments{
  commentId: string;
  content: string;
  createdAt: string;
  nickName: string;
  boardId: string;
}

export interface ResponseGetMemberReviews{
  reviewContent: string; //review
  reviewScore: number; //review
  facltNm: string;     //외부 api
  firstImageUrl: string; //외부 api
  mapX: number;
  mapY: number;
  createAt: string;
  id: string;
}

export interface ResponseVerifyPassword {
  success: boolean; // 백엔드에서 인증 성공 여부 반환한다고 가정
}

enum MemberGrade {
  GREEN,
  BLUE,
  RED,
  BLACK,
}

export interface ReqeustAddMember {
  email: string;
  password: string;
  name: string;
  nickname: string;
  birthday: string;
  phonenumber: string;
}
