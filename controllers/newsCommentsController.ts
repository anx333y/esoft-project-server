import { Request, Response } from "express";
import NewsCommentsService from "../services/newsCommentsService";
import { getQueryParams } from "../utils";

class NewsCommentsController {
	newsCommentsService: NewsCommentsService;

	constructor(newsCommentsService: NewsCommentsService) {
		this.newsCommentsService = newsCommentsService;
	}
	getAllNewsComments = async (req: Request, res: Response) => {
		try {
			const newsComments = await this.newsCommentsService.getAllNewsComments(getQueryParams(req));
			res.status(200).json(newsComments);
		} catch (error) {
			res.status(500).json({error: (error as Error).message});
		}
	};
	
	createNewsComment = async (req: Request, res: Response) => {
		try {
			const newsCommentData = req.body;
			if (!newsCommentData["news_id"] || !newsCommentData["author_id"] || !newsCommentData["content"]) {
				res.status(400).json({error: 'Incomplete data'});
				return;
			}
			const newNewsComment = await this.newsCommentsService.createNewsComment(req.body);
			res.status(201).json(newNewsComment);
		} catch (error) {
			res.status(500).json({error: (error as Error).message});
		}
	};

	getNewsCommentById = async (req: Request, res: Response) => {
		try {
			const newsComment = await this.newsCommentsService.getNewsCommentById(req.params.newsCommentId);
			if (!!newsComment) {
				res.status(200).json(newsComment[0]);
			} else {
				res.status(404).json({error: 'Comment not found'})
			}
		} catch (error) {
			res.status(500).json({error: (error as Error).message});
		}
	};

	deleteNewsComment = async (req: Request, res: Response) => {
		try {
			const newsComment = await this.newsCommentsService.deleteNewsComment(req.params.newsCommentId);
			if (!!newsComment) {
				res.status(200).json(newsComment);
			} else {
				res.status(404).json({error: 'Comment not found'})
			}
		} catch (error) {
			res.status(500).json({error: (error as Error).message});
		}
	};

	getNewsCommentsByNewsId = async (req: Request, res: Response) => {
		try {
			const newsComments = await this.newsCommentsService.getNewsCommentByNewsId(req.params.newsId);
			res.status(200).json(newsComments);
		} catch (error) {
			res.status(500).json({error: (error as Error).message});
		}
	};
};

export default NewsCommentsController;