export type userType = {
  msg: string | null;
  user : User | null;
  idToast :string;
}
export interface Address {
    name: string;
    street: string;
    city: string;
    country: string;
  }
  
  export interface User {
    firstName: string | undefined;
    lastName: string | undefined;
    gender: number | undefined; // 1 = Male, 2 = Female, etc. (you can define an enum if needed)
    phoneNumber: string | undefined;
    address: Address | null | undefined;
  }