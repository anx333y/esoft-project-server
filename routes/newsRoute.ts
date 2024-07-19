import NewsCommentsController from "../controllers/newsCommentsController";
import NewsController from "../controllers/newsController";
import express from "express";

export default (newsController: NewsController) => {
	const router = express.Router();

	router.route('/news')
		.get(newsController.getAllNews)
		.post(newsController.createNews);
	router.route('/news/:newsId')
		.get(newsController.getNewsById)
		.put(newsController.updateNews)
		.delete(newsController.deleteNews);

	return router;
};