import QueueController from "../controllers/queueController";
import express from "express";
import authorizeRole from "../middlewares/authorizeRole";

export default (queueController: QueueController) => {
	const router = express.Router();

	router.route('/queue')
		.get(queueController.getAllQueue)
		.post(authorizeRole(['admin']), queueController.createQueueRow);
	router.route('/queue-array')
		.post(authorizeRole(['admin']), queueController.createQueueArray);
	router.route('/queue/:queueId')
		.get(authorizeRole(['admin']), queueController.getQueueRowById)
		.put(queueController.updateQueueRow)
		.delete(authorizeRole(['admin']), queueController.deleteQueueRow);
	router.route('/queue/bydate/:date')
		.get(queueController.getQueueByDate);

	return router;
};