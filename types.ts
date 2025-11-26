
export interface QuoteItem {
  name: string;
  details: string; // np. "2.5 m2" albo "3 godziny"
  price: number; // cena netto łączna za pozycję
}

export interface QuoteData {
  items: QuoteItem[];
  totalNet: number;
}

export interface UploadedFile {
  file: File;
  preview: string | null; // base64 preview for images
}

export type DeadlineType = 'standard' | 'express' | 'extended';

export interface OrderData {
  type: 'private' | 'company';
  paymentMethod: 'proforma' | 'przelewy24';
  deadline: DeadlineType;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  zip: string;
  companyName: string;
  nip: string;
  companyAddress: string;
  companyCity: string;
  companyZip: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}
