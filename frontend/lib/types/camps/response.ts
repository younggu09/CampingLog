export interface ResponseGetBoardReviewRank {
  reviewAverage: number;
  firstImageUrl: string;
  doNm: string;
  sigunguNm: string;
  mapX: string;
  mapY: string;
  facltNm: string;
}

export interface ResponseGetBlahList {
  reviews: string[];
}

export interface ResponseGetCampWrapper<T> {
  items: T[];
  totalCount: number;
  totalPage: number;
  hasNext: boolean;
  page: number;
  size: number;
}

export interface ResponseGetCampLatestList {
  facltNm: string;
  doNm: string;
  sigunguNm: string;
  addr1: string;
  addr2: string;
  mapX: string;
  mapY: string;
  tel: string;
  sbrsCl: string;
  firstImageUrl: string;
  totalCount: number;
}

export interface ResponseGetCampDetail {
  facltNm: string;// 야영장명0
  lineIntro: string;// 한줄소개
  intro: string;// 소개
  hvofBgnde: string;// 휴장기간 휴무기간 시작일
  hvofEnddle: string;// 휴장기간 휴무기간 종료일
  featureNm: string;// 특징0
  induty: string;// 업종0
  lctCl: string;// 입지구분
  addr1: string;// 주소0
  addr2: string;// 주소상세0
  tel: string;// 전화0
  homepage: string;// 홈페이지0
  resveUrl: string;// 예약 페이지
  siteBottomCl1: string;// 잔디0
  siteBottomCl2: string;// 파쇄석0
  siteBottomCl3: string;// 테크0
  siteBottomCl4: string;// 자갈0
  siteBottomCl5: string;// 맨흙0
  operPdCl: string;// 운영기간0
  operDeCl: string;// 운영일0
  toiletCo: string;// 화장실 개수0
  swrmCo: string;// 샤워실 개수0
  wtrplCo: string;// 개수대 개수0
  sbrsCl: string;// 부대시설
  firstImageUrl: string;// 대표이미지0
  animalCmgCl: string;// 애완동물 출입
  eqpmnLendCl: string;// 캠핑장비 대여
  posblFcltyCl: string;// 주변 이용가능시설
  doNm: string;
  sigunguNm: string;
} 

export interface ResponseGetBoardReview {
  reviewAverage: number;
  reviewCount: number;
}

export interface ResponseGetCampByKeywordList {
  facltNm: string;
  doNm: string;
  sigunguNm: string;
  addr1: string;
  addr2: string;
  mapX: string;
  mapY: string;
  tel: string;
  sbrsCl: string;
  firstImageUrl: string;
}


export interface ResponseGetReviewList {
  email: string;
  nickname: string;
  reviewContent: string;
  reviewScore: number;
  reviewImage: string;
  createAt: string;
  updateAt: string;
}

