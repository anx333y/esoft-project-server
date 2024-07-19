import knexPool from "../config/db";
import { getAllQueryParams, queueData } from "../types";
import { formateRows } from "../utils";

class QueueModel {
	async getAll({
		page = -1,
		limit = -1,
		filterFields = [],
		filterValues = [],
		sortFields = [],
		sorts = [],
		selectFields = []
	}: getAllQueryParams) {
		let query = knexPool("queue");

		if (selectFields.length) {
			query.select(...selectFields);
		}

		if (page === -1 && limit === -1 && !filterFields.length && !filterValues.length && !sortFields.length && !sorts.length) {
			const rows = await query.orderBy(["queue_date", "queue_time"]);
			return formateRows(rows);
		}

		if (!selectFields.length) {
			query = knexPool("queue")
			.leftJoin("users", "users.id", "=", "queue.user_id")
			.select(
					"queue.id",
					"queue_date",
					"queue_time",
					knexPool.raw("COALESCE(queue.user_id, -1) as user_id"),
					knexPool.raw("COALESCE(users.full_name, '') as full_name"),
					knexPool.raw("COALESCE(users.email, '') as email"),
					"status"
			);
		}
		
		if (page !== -1 && limit !== -1) {
			const offset = (page - 1) * limit;
			query = query.limit(limit).offset(offset);
		}

		if (filterFields.length && filterValues.length && filterFields.length === filterValues.length) {
			for (let i = 0; i < filterFields.length; i++) {
				if (['queue_date', 'queue_time', 'status', 'user_id'].includes(filterFields[i])) {
					query = query.where(filterFields[i], filterValues[i]);
				} else {
					query = query.where(filterFields[i], 'ilike', `%${filterValues[i]}%`);
				}
			}
		}

		if (sortFields.length && sorts.length) {
			const orderByArr = [];
			for (let i = 0; i < sortFields.length; i++) {
				orderByArr.push({column: sortFields[i], order: sorts[i]});
			}
			query = query.orderBy(orderByArr);
		} else {
			query = query.orderBy(["queue_date", "queue_time"]);
		}

		const rows = await query;
		if (page !== -1 && limit !== -1) {
			const total = await knexPool("queue").count('queue_date as count').first();
			return {
				rows: formateRows(rows),
				total: total ? total.count : 0,
				page,
				limit
			};
		}
		return formateRows(rows);
	}


	async create(queueData: queueData | queueData[]) {
		const query = knexPool("queue")
			.insert(queueData)
			.returning('*');
		const rows = await query;
		return formateRows(rows);
	};

	async getById(id: string) {
		const query = knexPool
			.from("queue")
			.where("id", id);
		const rows = await query;
		const formattedRows = rows.map(row => {
			const tempDate = new Date(Date.parse(row.queue_date));
			tempDate.setDate(tempDate.getDate() + 1);
			return {
			...row,
			queue_date: tempDate.toISOString().split("T")[0]
		}});
		return formattedRows;
	};

	async update(id: string, queueData: queueData) {
		const query = knexPool("queue")
			.where("id", id)
			.update(queueData)
			.returning('*');
		const rows = await query;
		const formattedRows = rows.map(row => {
			const tempDate = new Date(row.queue_date);
			tempDate.setDate(tempDate.getDate() + 1);
			return {
			...row,
			queue_date: tempDate.toISOString().split("T")[0]
		}});
		return formattedRows;
	};

	async delete(id: string) {
		const query = knexPool("queue")
			.where("id", id)
			.del()
			.returning('*');
		const rows = await query;
		const formattedRows = rows.map(row => {
			const tempDate = new Date(Date.parse(row.queue_date));
			tempDate.setDate(tempDate.getDate() + 1);
			return {
			...row,
			queue_date: tempDate.toISOString().split("T")[0]
		}});
		return formattedRows;
	};

	async getByDate(queueDate: string) {
		const query = knexPool
			.from("queue")
			.where("queue_date", queueDate)
			.leftJoin("users", "queue.user_id", "users.id")
			.select(
				"queue.id",
				"queue_date",
				"queue_time",
				"user_id",
				"full_name",
				"email",
				"status"
			)
			.orderBy(["queue_date", "queue_time"]);
		const rows = await query;
		const formattedRows = rows.map(row => {
			const tempDate = new Date(Date.parse(row.queue_date));
			tempDate.setDate(tempDate.getDate() + 1);
			return {
			...row,
			queue_date: tempDate.toISOString().split("T")[0]
		}});
		return formattedRows;
	};
};

export default QueueModel;

export type { QueueModel };

// async function addRecords() {
// 	const today = new Date("2024-07-24");
// 	let nextWeekDateTime = [];
// 	const daysToMonday = Math.abs((7 - today.getDay()) % 7 + 1);
// 	const nextDate = new Date(today);
// 	nextDate.setDate(today.getDate() + daysToMonday);
// 	for (let i = 0; i < 5; i++) {
// 		const addedDate = nextDate.toISOString().split('T')[0];
// 		const tempTime = new Date();
// 		tempTime.setHours(13);
// 		tempTime.setMinutes(30);
// 		tempTime.setSeconds(0);
// 		while (tempTime.toTimeString().split(' ')[0] <= "17:00:00") {
// 			nextWeekDateTime.push({
// 				"queue_date": nextDate.toISOString().split('T')[0],
// 				"queue_time": tempTime.toTimeString().split(' ')[0]
// 			});
// 			tempTime.setMinutes(tempTime.getMinutes() + 3);
// 		}
// 		nextDate.setDate(nextDate.getDate() + 1);
// 	}

// 	if (nextWeekDateTime.length > 0) {
// 		await knexPool('queue').insert(nextWeekDateTime).returning('*');
// 	}
// }

// addRecords();