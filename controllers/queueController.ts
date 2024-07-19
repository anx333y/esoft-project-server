import { Request, Response } from "express";
import QueueService from "../services/queueService";
import { getQueryParams } from "../utils";

class QueueController {
	queueService: QueueService;

	constructor(queueService: QueueService) {
		this.queueService = queueService;
	}

	getAllQueue = async (req: Request, res: Response) => {
		try {
			const queue = await this.queueService.getAllQueue(getQueryParams(req));
			res.status(200).json(queue);
		} catch (error) {
			res.status(500).json({error: (error as Error).message});
		}
	};
	
	createQueueRow = async (req: Request, res: Response) => {
		try {
			const queueRowData = req.body;
			if (!queueRowData["queue_date"] || !queueRowData["queue_time"]) {
				res.status(400).json({error: 'Incomplete data'});
				return;
			}
			const newQueue = await this.queueService.createQueueRow(req.body);
			res.status(201).json(newQueue);
		} catch (error) {
			res.status(500).json({error: (error as Error).message});
		}
	};

	getQueueRowById = async (req: Request, res: Response) => {
		try {
			const queueRow = await this.queueService.getQueueRowById(req.params.queueId);
			if (!!queueRow) {
				res.status(200).json(queueRow);
			} else {
				res.status(404).json({error: 'Queue Row not found'})
			}
		} catch (error) {
			res.status(500).json({error: (error as Error).message});
		}
	};

	updateQueueRow = async (req: Request, res: Response) => {
		try {
			const queueRow = await this.queueService.updateQueueRow(req.params.queueId, req.body);
			if (!!queueRow) {
				res.status(201).json(queueRow);
			} else {
				res.status(404).json({error: 'Queue Row not found'})
			}
		} catch (error) {
			res.status(500).json({error: (error as Error).message});
		}
	};

	deleteQueueRow = async (req: Request, res: Response) => {
		try {
			const queueRow = await this.queueService.deleteQueueRow(req.params.queueId);
			if (!!queueRow) {
				res.status(200).json(queueRow);
			} else {
				res.status(404).json({error: 'Queue Row not found'})
			}
		} catch (error) {
			res.status(500).json({error: (error as Error).message});
		}
	};

	getQueueByDate = async (req: Request, res: Response) => {
		try {
			const queue = await this.queueService.getQueueByDate(req.params.date);
			res.status(200).json(queue);
		} catch (error) {
			res.status(500).json({error: (error as Error).message});
		}
	};

	createQueueArray = async (req: Request, res: Response) => {
		try {
			const args = {
				startDate: req.body.startDate || '',
				selectDays: req.body.selectDays || [0, 1, 2, 3, 4],
				startTime: req.body.startTime || '13:30:00',
				endTime: req.body.endTime || '17:00:00',
				delay: req.body.delay || 3
			}
			const newQueueArr = await this.queueService.createQueueArray(args);
			res.status(201).json(newQueueArr);
		} catch (error) {
			res.status(500).json({error: (error as Error).message});
		}
	};

};

export default QueueController;