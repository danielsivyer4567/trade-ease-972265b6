
export interface PaymentFormData {
  cardNumber: string;
  cardHolderName: string;
  expirationMonth: string;
  expirationYear: string;
  cvv: string;
  totalAmount: string;
  currency: string;
  email: string;
  firstName: string;
  lastName: string;
  address1: string;
  locality: string;
  administrativeArea: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
  capturePayment: boolean;
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

export interface PaymentResponse {
  id: string;
  amount: string;
  currency: string;
  status: string;
  timestamp: string;
  cardInfo: {
    last4: string;
    expirationMonth: string;
    expirationYear: string;
  };
}
