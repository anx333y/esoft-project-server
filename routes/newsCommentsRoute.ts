import NewsCommentsController from "../controllers/newsCommentsController";
import express from "express";

export default (newsCommentsController: NewsCommentsController) => {
	const router = express.Router();

	router.route('/news-comments')
		.get(newsCommentsController.getAllNewsComments)
		.post(newsCommentsController.createNewsComment);
	router.route('/news-comments/:newsCommentId')
		.get(newsCommentsController.getNewsCommentById)
		.delete(newsCommentsController.deleteNewsComment);
	router.route('/news-comments/news/:newsId')
		.get(newsCommentsController.getNewsCommentsByNewsId)

	return router;
};