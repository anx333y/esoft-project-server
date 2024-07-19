import QueueModel from "../models/queueModel";
import { addArrayRecordsArgs, queueData } from "../types";
import { getAllQueryParams } from "../types";
import mailService from "./mailService";
const schedule = require('node-schedule');

class QueueService {
	queueModel: QueueModel;

	constructor(queueModel: QueueModel) {
		this.queueModel = queueModel;
	}
	async getAllQueue(args: getAllQueryParams) {
		return this.queueModel.getAll(args);
	};
	
	async createQueueRow(queueData: queueData) {
		return this.queueModel.create({
			user_id: queueData.user_id,
			queue_date: queueData.queue_date,
			queue_time: queueData.queue_time,
			status: queueData.status
		});
	};


	async getQueueRowById(id: string) {
		return this.queueModel.getById(id);
	};

	async updateQueueRow(id: string, queueData: queueData) {
		return this.queueModel.update(id, queueData);
	};

	async deleteQueueRow(id: string) {
		return this.queueModel.delete(id);
	};

	async getQueueByDate(queueDate: string) {
		return this.queueModel.getByDate(queueDate);
	}

	async remindUserRecording() {
		const today = new Date().getTime();
		const hours = [24, 6, 2];
		// const delay = 3600 * 1000;
		const delay = 60 * 1000;

		const bookedQueue = await this.queueModel.getAll({
			filterFields: ['status'],
			filterValues: ['booked']
		});
		if (!Array.isArray(bookedQueue)) {
			return;
		}
		for (const row of bookedQueue) {
			if (!row.email) {
				continue;
			}
			const date = new Date(row.queue_date);
			const timeArr = row.queue_time.split(':');
			date.setHours(parseInt(timeArr[0]));
			date.setMinutes(parseInt(timeArr[1]));
			for (const hour of hours) {
				if (today + hour * 3600 * 1000 < date.getTime() && date.getTime() < today + (hour) * 3600 * 1000 + delay) {
					const sendDate = new Date(date.getTime() - hour * 3600 * 1000);
					const job = schedule.scheduleJob(sendDate, () => {
						mailService.sendReminderMail(String(row.email), hour, row);
					})
					console.log('Создана задача, напомнить ', sendDate);
				}
			}
		}
	}

	async createQueueArray({
		startDate = '',
		selectDays = [0, 1, 2, 3, 4],
		startTime = '13:30:00',
		endTime = '17:00:00',
		delay = 3
	}: addArrayRecordsArgs) {
		let nextDate = new Date(startDate);
		if (!startDate) {
			const today = new Date();
			const daysToMonday = Math.abs((7 - today.getDay()) % 7 + 1);
			nextDate = new Date(today.getTime());
			nextDate.setDate(today.getDate() + daysToMonday);
		}
		const startTimeArr = startTime.split(':').map(time => parseInt(time));
		let nextWeekDateTime = [];
		for (let i = 0; i < 7; i++) {
			if (!selectDays.includes(i)) {
				nextDate.setDate(nextDate.getDate() + 1);
				continue;
			}
			const tempTime = new Date();
			tempTime.setHours(startTimeArr[0]);
			tempTime.setMinutes(startTimeArr[1]);
			tempTime.setSeconds(startTimeArr[2]);
			while (tempTime.toTimeString().split(' ')[0] <= endTime) {
				nextWeekDateTime.push({
					"queue_date": nextDate.toISOString().split('T')[0],
					"queue_time": tempTime.toTimeString().split(' ')[0]
				});
				tempTime.setMinutes(tempTime.getMinutes() + delay);
			}
			nextDate.setDate(nextDate.getDate() + 1);
		}

		if (nextWeekDateTime.length > 0) {
			return await this.queueModel.create(nextWeekDateTime);
		}
	}
};

export default QueueService;