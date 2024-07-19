import { Request } from "express";

export type Role = 'admin' | 'user';

export type userData = {
	id: string;
	full_name?: string;
	email: string;
	password: string;
	role?: Role;
	is_activated?: oolean;
	activation_link?: string;
};

export type queueData = {
	queue_date: string;
	queue_time: string;
	user_id?: string;
	status?: 'free' | 'booked' | 'passed' | 'missed' | 'process';
	email?: string;
};

export type newsData = {
	author_id: string;
	title: string;
	content: string;
};

export type newsCommentsData = {
	id?: string;
	news_id?: string;
	comment_author_id?: string;
	comment_text?: string;
	created_at?: string;
};

export interface RequestWithUser extends Request {
	user?: userData;
};

export type tokenData = {
	user_id: string;
	refresh_token: string;
}

export type getAllQueryParams = {
	page?: number,
	limit?: number,
	filterFields?: string[] | [],
	filterValues?: string[] | [],
	sortFields?: string[] | [],
	sorts?: string[] | [],
	selectFields?: string[] | [],
	quickSearchValue?: string;
};

export type userCalendarData = {
	user_id: string;
	ical_link: string;
}

export type addArrayRecordsArgs = {
	startDate?: string;
	selectDays?: number[];
	startTime?: string;
	endTime?: string;
	delay?: number;
	countWeeks?: number;
	isNextWeek?: boolean;
}