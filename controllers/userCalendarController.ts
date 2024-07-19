import { Request, Response } from "express";
import UserCalendarService from "../services/userCalendarService";

class UserCalendarController {
	userCalendarService: UserCalendarService;

	constructor(userCalendarService: UserCalendarService) {
		this.userCalendarService = userCalendarService;
	}

	saveUserCalendar = async (req: Request, res: Response) => {
		try {
			const {user_id, link} = req.body;
			const userCalendar = await this.userCalendarService.saveUserCalendar(user_id, link);
			if (!userCalendar[0]) {
				return res.status(404).json({error: "Calendar not found"});
			}
			const dataFromUserCalendarLink = await this.userCalendarService.getDataFromUserCalendarLink(userCalendar[0]['ical_link']);
			if (!dataFromUserCalendarLink) {
				return res.status(500).json({error: "Can't parse calendar"});
			}
			return res.status(201).json({...userCalendar[0], rows: dataFromUserCalendarLink});
		} catch (error) {
			res.status(500).json({error: (error as Error).message});
		}
	};

	deleteUserCalendar = async (req: Request, res: Response) => {
		try {
			const user_id = req.params.userId;
			const userCalendar = await this.userCalendarService.deleteUserCalendar("user_id", user_id);
			if (!userCalendar[0]) {
				return res.status(404).json({error: "Calendar not found"});
			}
			return res.status(200).json(userCalendar[0]);
		} catch (error) {
			res.status(500).json({error: (error as Error).message});
		}
	};

	getDataFromUserCalendar = async (req: Request, res: Response) => {
		try {
			const user_id = req.params.userId;
			const userCalendar = await this.userCalendarService.getUserCalendar("user_id", user_id);
			if (!userCalendar[0]) {
				return res.status(404).json({error: "Calendar not found"});
			}
			const dataFromUserCalendarLink = await this.userCalendarService.getDataFromUserCalendarLink(userCalendar[0]['ical_link']);
			if (!dataFromUserCalendarLink) {
				return res.status(500).json({error: "Can't parse calendar"});
			}
			return res.status(200).json({...userCalendar[0], rows: dataFromUserCalendarLink});
		} catch (error) {
			res.status(500).json({error: (error as Error).stack});
		}
	};

	validateUserCalendarLink = async (req: Request, res: Response) => {
		try {
			const { link } = req.body;
			const isLinkValidate = await this.userCalendarService.validateUserCalendarLink(link);
			
			return res.status(200).json({result: isLinkValidate});
		} catch (error) {
			res.status(500).json({error: (error as Error).message});
		}
	};
};

export default UserCalendarController;