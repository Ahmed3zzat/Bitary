export interface CartItem {
  id: string;
  productId: number|undefined;
  productName: string;
  description: string | null;
  pictureUrl: string;
  price: number;
  quantity: number;
}



export interface Basket {
  id: string | null ;
  items: CartItem[] | null;
  paymentIntentId: string | null;
  clientSecret: string | null;
  deliveryMethodId: string | null;
  shippingPrice: number | null;
  idToast: string;
  isError: boolean;
  isLoading: boolean;
  checkBasketExist: boolean;
  totalPrice?:number,
  itemsLength?:number|null
}
