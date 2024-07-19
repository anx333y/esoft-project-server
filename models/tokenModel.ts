import knexPool from "../config/db";
import { tokenData } from "../types";


class TokenModel {
	async getAll() {
		const query = knexPool.from("tokens");
		const rows = await query;
		return rows;
	};

	async create(tokenData: tokenData) {
		const query = knexPool("tokens")
			.insert(tokenData)
			.returning("*");
		const rows = await query;
		return rows;
	};

	async getByField(fieldName: string, field: string) {
		const query = knexPool
			.from("tokens")
			.where(fieldName, field);
		const rows = await query;
		return rows;
	};

	async update(id: string, tokenData: Partial<tokenData>) {
		const query = knexPool("tokens")
			.where("user_id", id)
			.update(tokenData)
			.returning("*");
		const rows = await query;
		return rows;
	};

	async deleteByField(fieldName: string, field: string) {
		const query = knexPool("tokens")
			.where(fieldName, field)
			.del()
			.returning("*");
		const rows = await query;
		return rows;
	};
};

export default TokenModel;