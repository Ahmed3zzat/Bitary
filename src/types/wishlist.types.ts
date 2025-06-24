export type wishlistRespone = {
  WishListData: Wishlist | null;
  msg: string | null;
  isError: boolean;
  isLoading: boolean;
  idToast: string;
  checkExist:boolean
};

export interface WishlistItem {
  id: number;
  productId: number;
  productName: string;
  productPictureUrl: string;
  productPrice: number;
  productBrand: string;
  productCategory: string;
  addedAt: string;
}

export interface Wishlist {
  id: number;
  userId: string;
  createdAt: string;
  items: WishlistItem[] | null;
}
