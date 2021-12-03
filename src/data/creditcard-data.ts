export interface ExpirationDate {
	month: string;
	year: string;
}

export class CreditCard {
	public number: string = "";
	public name: string = "";
	public expirationDate!: ExpirationDate;
	public cvc: string = "";
}
