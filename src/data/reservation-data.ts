import User from "./user-data";

class Reservation {
  /* tslint:disable:no-empty */
  constructor() {}
  public id: number = -1;
  public createTime: number = -1;
  public guests: number = -1;
  public startTime: number = -1;
  public status: number = -1;
  public user: User | undefined = undefined;
}

export default Reservation;
