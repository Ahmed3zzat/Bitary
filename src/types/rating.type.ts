export type RatingRespone = {
  msg: string | null;
  isError: boolean;
  isLoading: boolean;
  idToast: string;
  reviewIdClinic: ClinicReviews[] ;
  reviewUserClinic: ClinicReviews[] ;
  ratingDetails: ClinicRating|null ;
  checker:boolean;
};
export interface ClinicData {
  clinicId: number;
  ratingValue: number;
  comment: string;
}
export interface RateData {
  ratingValue: number;
  comment: string;
}
export interface ClinicReviews {
  id: number;
  userId: string;
  userName: string;
  clinicId: number;
  clinicName: string;
  ratingValue: number;
  comment: string;
  createdAt: string;
}


export type RatingValue = 1 | 2 | 3 | 4 | 5;
export interface ClinicRating {
  id: number;
  userId: string;
  userName: string;
  clinicId: number;
  clinicName: string;
  ratingValue: RatingValue;
  comment: string;
  createdAt: string; 
}
