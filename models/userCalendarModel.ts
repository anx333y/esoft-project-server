import knexPool from "../config/db";
import { userCalendarData } from "../types";

class UserCalendarModel {
	async getAll() {
		const query = knexPool.from("user_calendar");
		const rows = await query;
		return rows;
	};

	async create(userCalendarData: userCalendarData) {
		const query = knexPool("user_calendar")
			.insert(userCalendarData)
			.returning("*");
		const rows = await query;
		return rows;
	};

	async getByField(fieldName: string, field: string) {
		const query = knexPool
			.from("user_calendar")
			.where(fieldName, field);
		const rows = await query;
		return rows;
	};

	async update(id: string, userCalendarData: Partial<userCalendarData>) {
		const query = knexPool("user_calendar")
			.where("user_id", id)
			.update(userCalendarData)
			.returning("*");
		const rows = await query;
		return rows;
	};

	async deleteByField(fieldName: string, field: string) {
		const query = knexPool("user_calendar")
			.where(fieldName, field)
			.del()
			.returning("*");
		const rows = await query;
		return rows;
	};

	async fetchICalLink(link: string) {
		const response = await fetch(link);
		return {
			status: response.status,
			data: await response.text()
		};
	}
};

export default UserCalendarModel;