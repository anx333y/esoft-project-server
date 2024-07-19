import knexPool from "../config/db";
import { getAllQueryParams, newsData } from "../types";

class NewsModel {
	async getAll({
		page = -1,
		limit = -1,
		filterFields = [],
		filterValues = [],
		sortFields = [],
		sorts = [],
		selectFields = [],
		quickSearchValue = ''
	}: getAllQueryParams) {
		let query = knexPool("news")
		.select(
			'news.id',
			'news.title',
			'news.author_id',
			'news.content',
			'news.created_at',
			knexPool.raw('COUNT(news_comments.id) as news_comments_count')
		)
		.leftJoin('news_comments', 'news.id', 'news_comments.news_id')
		.groupBy('news.id', 'news.title', 'news.content');

		if (quickSearchValue) {
			query
				.where('news.title', 'ILIKE', `%${quickSearchValue}%`)
				.orWhere('news.content', 'ILIKE', `%${quickSearchValue}%`);
			const rows = await query.orderBy("id", "desc");
			return rows;
		}

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
			const total = await knexPool("news").count('id as count').first();
			return {
				rows: rows,
				total: total ? total.count : 0,
				page,
				limit
			};
		}
		return rows;
	};

	async create(newsData: newsData) {
		const query = knexPool("news")
			.insert(newsData);
		const rows = await query;
	};

	async getById(id: string) {
		const query = knexPool
			.from("news")
			.where("id", id);
		const rows = await query;
		return rows;
	};

	async update(id: string, newsData: newsData) {
		const query = knexPool("news")
			.where("id", id)
			.update(newsData);
		const rows = await query;
		return rows;
	};

	async delete(id: string) {
		const query = knexPool("news")
			.where("id", id)
			.del();
		const rows = await query;
		return rows;
	};
};

export default NewsModel;