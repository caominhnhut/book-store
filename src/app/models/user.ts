export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    address?: Address;
    role?: 'admin' | 'user' | 'manager'; // Thêm role để phân quyền
  }
  
  export interface Address {
    street: string;
    city: string;
    district: string;
    postalCode?: string;
    country: string;
  }