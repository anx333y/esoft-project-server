import UserCalendarModel from "../models/userCalendarModel";

const ical = require('ical.js');

class UserCalendarService {
	userCalendarModel: UserCalendarModel;

	constructor(userCalendarModel: UserCalendarModel) {
		this.userCalendarModel = new UserCalendarModel;
	}

	async saveUserCalendar(userId: string, link: string) {
		const userCalendarData = await this.userCalendarModel.getByField("user_id", userId);
		if (userCalendarData.length) {
			const updatedUserCalendar = await this.userCalendarModel.update(userId, {"ical_link": link});
			return updatedUserCalendar;
		}
		const userCalendar = await this.userCalendarModel.create({user_id: userId, "ical_link": link});
		return userCalendar;
	}

	async deleteUserCalendar(field: string, fieldValue: string) {
		const userCalendar = await this.userCalendarModel.deleteByField(field, fieldValue);
		return userCalendar;
	}

	async getUserCalendar(field: string, fieldValue: string) {
		const userCalendar = await this.userCalendarModel.getByField(field, fieldValue);
		return userCalendar;
	}

	async getDataFromUserCalendarLink(link: string) {
		const dataFromUserCalendarLink = await this.userCalendarModel.fetchICalLink(link);
		if (dataFromUserCalendarLink.status !== 200) {
			throw new Error ('Link is not valid');
		}
		const jcalData = ical.parse(dataFromUserCalendarLink.data);
		const component = new ical.Component(jcalData);
		const events = component.getAllSubcomponents('vevent');

		const parsedEvents = events.map((event: any) => {
			const eventData = new ical.Event(event);
			return {
				start: eventData.startDate.toJSDate(),
				end: eventData.endDate.toJSDate(),
			};
		});

		return parsedEvents;
	}

	async validateUserCalendarLink(link: string) {
		const dataFromUserCalendarLink = await this.userCalendarModel.fetchICalLink(link);
		if (dataFromUserCalendarLink.status !== 200) {
			return false;
		}
		const jcalData = ical.parse(dataFromUserCalendarLink.data);
		const component = new ical.Component(jcalData);

		return component.name === 'vcalendar';
	}
}

export default UserCalendarService;