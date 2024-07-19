import { Request, Response } from "express";
import NewsService from "../services/newsService";
import { getQueryParams } from "../utils";

class NewsController {
	newsService: NewsService;

	constructor(newsService: NewsService) {
		this.newsService = newsService;
	}
	getAllNews = async (req: Request, res: Response) => {
		try {
			const quickSearchValue = req.query.quickSearchValue ? String(req.query.quickSearchValue) : '';
			const news = await this.newsService.getAllNews({...getQueryParams(req), quickSearchValue});
			res.status(200).json(news);
		} catch (error) {
			res.status(500).json({error: (error as Error).message});
		}
	};
	
	createNews = async (req: Request, res: Response) => {
		try {
			const newsData = req.body;
			if (!newsData["author_id"] || !newsData["title"] || !newsData["content"]) {
				res.status(400).json({error: 'Incomplete data'});
				return;
			}
			const newNews = await this.newsService.createNews(req.body);
			res.status(201).json(newNews);
		} catch (error) {
			res.status(500).json({error: (error as Error).message});
		}
	};

	getNewsById = async (req: Request, res: Response) => {
		try {
			const news = await this.newsService.getNewsById(req.params.newsId);
			if (!!news) {
				res.status(200).json(news[0]);
			} else {
				res.status(404).json({error: 'News not found'})
			}
		} catch (error) {
			res.status(500).json({error: (error as Error).message});
		}
	};

	updateNews = async (req: Request, res: Response) => {
		try {
			const news = await this.newsService.updateNews(req.params.newsId, req.body);
			if (!!news) {
				res.status(201).json(news);
			} else {
				res.status(404).json({error: 'News not found'})
			}
		} catch (error) {
			res.status(500).json({error: (error as Error).message});
		}
	};

	deleteNews = async (req: Request, res: Response) => {
		try {
			const news = await this.newsService.deleteNews(req.params.newsId);
			if (!!news) {
				res.status(200).json(news);
			} else {
				res.status(404).json({error: 'News not found'})
			}
		} catch (error) {
			res.status(500).json({error: (error as Error).message});
		}
	};
};

export default NewsController;