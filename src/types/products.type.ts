export type productResponse = {
  msg: string | null|undefined;
  products: Product[]|null|undefined;
  isError: boolean;
  isLoading: boolean;
  idToast: string;
};

export interface PaginatedProductResponse {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  data: Product[];
}

export interface Product {
  id: number;
  name: string;
  description: string;
  pictureUrl: string;
  quantity: number;
  price: number; // Note: Consider using 'number' for currency (or convert to decimal)
  brandName: string;
  categoryName: string;
  
}
