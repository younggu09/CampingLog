export interface RequestAddReview {
    mapX: string;
    mapY: string;
    reviewContent: string;
    reviewScore: number;
    reviewImage: string;
}

export interface RequestSetReview {
    id: number;
    mapX: string;
    mapY: string;
    newReviewContent: string;
    newReviewScore: number;
    newReviewImage: string;
}

export interface RequestRemoveReview {
    id: number;
}
