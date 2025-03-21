
export interface PaymentFormData {
  cardNumber: string;
  cardHolderName: string;
  expirationMonth: string;
  expirationYear: string;
  cvv: string;
  totalAmount: string;
  currency: string;
  capturePayment: boolean;
  email?: string;
  firstName?: string;
  lastName?: string;
  address1?: string;
  locality?: string;
  administrativeArea?: string;
  postalCode?: string;
  country?: string;
  phoneNumber?: string;
}

export interface ValidatedPaymentData {
  cardNumber: string;
  expirationMonth: string;
  expirationYear: string;
  totalAmount: string;
  currency: string;
  capturePayment: boolean;
  billTo: {
    firstName: string;
    lastName: string;
    address1: string;
    locality: string;
    administrativeArea: string;
    postalCode: string;
    country: string;
    email: string;
    phoneNumber: string;
  };
}
