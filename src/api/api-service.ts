import axios from "axios";
import { from, Observable } from "rxjs";

export class ApiService {
  private static SERVICE_URL = "http://localhost:5050/";

  public static getReservation(reservationId: string): Observable<any> {
    return from(axios.get(this.SERVICE_URL + `reservation?reservationId=${reservationId}`))
  }

  public static cancelReservation(reservationId: string): Observable<any> {
    return from(axios.delete(this.SERVICE_URL + `reservation?reservationId=${reservationId}`))
  }

  public static createReservation(date: number, size: number): Observable<any> {
    return from(axios.post(this.SERVICE_URL + `reservation?datetime=${date}&size=${size}`));
  }

  public static bookReservation(data: any): Observable<any> {
    return from(axios.post(this.SERVICE_URL + `reservation/book`, data));
  }

  public static getReservationsByUserId(userId: string): Observable<any> {
    return from(axios.get(this.SERVICE_URL + `reservations?userId=${userId}`))
  }

  public static getReservations(): Observable<any> {
    return from(axios.get(this.SERVICE_URL + "reservations/all"));
  }
  
}
