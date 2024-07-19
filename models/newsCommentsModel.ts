import { knexPool } from "../config/db";
import { getAllQueryParams, newsCommentsData } from "../types";

class NewsCommentsModel {

	async getAll({
		page = -1,
		limit = -1,
		filterFields = [],
		filterValues = [],
		sortFields = [],
		sorts = [],
		selectFields = []
	}: getAllQueryParams) {
		let query = knexPool("news_comments")
			.join("news", "news_comments.news_id", "news.id")
			.select('news_comments.*', "news.title");

		if (selectFields.length) {
			query.select(...selectFields);
		}

		if (page === -1 && limit === -1 && !filterFields.length && !filterValues.length && !sortFields.length && !sorts.length) {
			const rows = await query.orderBy("id", "desc");
			return rows;
		}
		
		if (page !== -1 && limit !== -1) {
			const offset = (page - 1) * limit;
			query = query.limit(limit).offset(offset);
		}

		if (filterFields.length && filterValues.length && filterFields.length === filterValues.length) {
			for (let i = 0; i < filterFields.length; i++) {
				if (['created_at', 'id', 'news_id', 'author_id'].includes(filterFields[i])) {
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
			query = query.orderBy("id");
		}

		const rows = await query;
		if (page !== -1 && limit !== -1) {
			const total = await knexPool("news_comments").count('id as count').first();
			return {
				rows: rows,
				total: total ? total.count : 0,
				page,
				limit
			};
		}
		return rows;
	};

	async create(commentData: newsCommentsData) {
		const query = knexPool("news_comments")
			.insert(commentData)
			.returning('*');
		const rows = await query;
		return rows;
	};

	async getByField(field: string, fieldValue: string) {
		const query = knexPool
			.from("news_comments")
			.join("users", "users.id", "news_comments.author_id")
			.select(
				"news_comments.id",
				"users.full_name",
				"news_id",
				"author_id",
				"content",
				"created_at"
			)
			.where(field, fieldValue);
		const rows = await query;
		return rows;
	};

	async delete(id: string) {
		const query = knexPool("news_comments")
			.where("id", id)
			.del()
			.returning('*');
		const rows = await query;
		return rows;
	};
};

export default NewsCommentsModel;