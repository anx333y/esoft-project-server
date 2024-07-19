import NewsCommentsModel from "../models/newsCommentsModel";
import { getAllQueryParams, newsCommentsData } from "../types";

class NewsCommentsService {
	newsCommentsModel: NewsCommentsModel;

	constructor(newsCommentsModel: NewsCommentsModel) {
		this.newsCommentsModel = newsCommentsModel;
	}

	async getAllNewsComments(args: getAllQueryParams) {
		return this.newsCommentsModel.getAll(args);
	};
	
	async createNewsComment(newsCommentsData: newsCommentsData) {
		return this.newsCommentsModel.create(newsCommentsData);
	};


	async getNewsCommentById(id: string) {
		return this.newsCommentsModel.getByField("id", id);
	};

	async getNewsCommentByNewsId(newsId: string) {
		return this.newsCommentsModel.getByField("news_id", newsId);
	};

	async deleteNewsComment(id: string) {
		return this.newsCommentsModel.delete(id);
	};
};

export default NewsCommentsService;