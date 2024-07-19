import knexPool from "../config/db";
import { getAllQueryParams, userData } from "../types";

class UserModel {
	async getAll({
		page = -1,
		limit = -1,
		filterFields = [],
		filterValues = [],
		sortFields = [],
		sorts = [],
		selectFields = []
	}: getAllQueryParams) {
		if (!selectFields.length) {
			selectFields = ["id", "full_name", "email", "role", "is_activated"];
		}
		let query = knexPool("users");
		if (page === -1 && limit === -1 && !filterFields.length && !filterValues.length && !sortFields.length && !sorts.length) {
			const rows = await query.select(...selectFields).orderBy("id");
			return rows;
		}
		
		if (page !== -1 && limit !== -1) {
			const offset = (page - 1) * limit;
			query = query.limit(limit).offset(offset);
		}

		if (filterFields.length && filterValues.length && filterFields.length === filterValues.length) {
			for (let i = 0; i < filterFields.length; i++) {
				if (['is_activated', 'id'].includes(filterFields[i])) {
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
			query = query.orderBy("id")
		}

		const rows = await query.select(...selectFields);
		const total = await knexPool("users").count('id as count').first();
		if (page !== -1 && limit !== -1) {
			return {
				rows: rows,
				total: total ? total.count : 0,
				page,
				limit
			};
		}
		return rows;
	}
	async create(userData: userData) {
		const query = knexPool("users")
			.insert(userData)
			.returning("*");
		const rows = await query;
		return rows;
	};

	async getByField(fieldName: string, field: string) {
		const query = knexPool
			.from("users")
			.where(fieldName, field);
		const rows = await query;
		return rows;
	};

	async update(id: string, userData: Partial<userData>) {
		const query = knexPool("users")
			.where("id", id)
			.update(userData)
			.returning("*");
		const rows = await query;
		return rows;
	};

	async delete(id: string) {
		const query = knexPool("users")
			.where("id", id)
			.del()
			.returning("*");
		const rows = await query;
		return rows;
	};
};

export default UserModel;