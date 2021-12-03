import { map } from "rxjs";
import { ApiService } from "./api-service";

import Reservation from "../data/reservation-data";
import User from "../data/user-data";

class ApiManager {
	public static getReservation(reservationId: string) {
		const observable = ApiService.getReservation(reservationId).pipe(
			map((ret: any) =>
				ApiManager.getReservationFromData(ret.data.reservation)
			)
		);
		return observable;
	}

	public static cancelReservation(reservationId: string) {
		const observable = ApiService.cancelReservation(reservationId);
		return observable;
	}

	public static createReservation(date: number, size: number) {
		const observable = ApiService.createReservation(date, size).pipe(
			map((ret) => {
				const output = {
					reservationId: ret.data.reservationId,
					isHoliday: ret.data.isHoliday,
				};
				return output;
			})
		);
		return observable;
	}

	public static bookReservation(reservationId: string, user: User) {
		const data = {
			reservationId,
			user: {
				id: user.id,
				firstName: user.firstName,
				lastName: user.lastName,
				phoneNumber: user.phoneNumber,
				email: user.email,
			},
		};
		const observable = ApiService.bookReservation(data);
		return observable;
	}

	public static getReservationsByUserId(userId: string) {
		const observable = ApiService.getReservationsByUserId(userId).pipe(
			map((ret) =>
				ApiManager.getFormattedReservations(ret.data.reservations)
			)
		);
		return observable;
	}

	public static getReservations() {
		const observable = ApiService.getReservations().pipe(
			map((ret) =>
				ApiManager.getFormattedReservations(ret.data.reservations)
			)
		);
		return observable;
	}

	private static getFormattedReservations(data: any) {
		const reservationList: Reservation[] = [];
		for (const reservationData of data)
			reservationList.push(
				ApiManager.getReservationFromData(reservationData)
			);
		return reservationList;
	}

	public static getReservationFromData(reservationData: any) {
		const reservation = new Reservation();
		reservation.id = reservationData.id;
		reservation.createTime = reservationData.createTime;
		reservation.guests = reservationData.guests;
		reservation.startTime = reservationData.startTime;
		reservation.status = reservationData.status;
		reservation.user = ApiManager.getUserFromData(reservationData.user);
		return reservation;
	}

	public static getUserFromData(userData: any) {
		const user = new User();

		// Registered user
		if (typeof userData === "string") {
			user.id = userData;
		}

		// Guest user
		else if (typeof userData === "object") {
			user.id = userData.id;
			user.firstName = userData.firstName;
			user.lastName = userData.lastName;
			user.phoneNumber = userData.phoneNumber;
			user.email = userData.email;
			user.memberPoints = userData.memberPoints;
		} else if (userData === undefined) {
			console.log(
				"ApiManager.getFormattedReservations: User not defined"
			);
		} else {
			console.log(
				"ApiManager.getFormattedReservations: User type not recognized. User = " +
					userData
			);
		}

		return user;
	}
}

export default ApiManager;
