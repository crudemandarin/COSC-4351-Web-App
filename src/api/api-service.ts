import axios from "axios";
import { from, Observable } from "rxjs";

export class ApiService {
  private static SERVICE_URL = "http://localhost:5050/";

  public static getReservations(): Observable<any> {
    return from(axios.get(this.SERVICE_URL + "reservations"));
  }
}
