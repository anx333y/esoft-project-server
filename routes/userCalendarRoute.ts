import UserCalendarController from "../controllers/userCalendarController";
import express from "express";

export default (userCalendarController: UserCalendarController) => {
	const router = express.Router();

	router.route('/user-calendar')
		.post(userCalendarController.saveUserCalendar);
	router.route('/user-calendar/:userId')
		.get(userCalendarController.getDataFromUserCalendar)
		.delete(userCalendarController.deleteUserCalendar);
	router.route('/user-calendar/validate/')
		.post(userCalendarController.validateUserCalendarLink)

	return router;
};