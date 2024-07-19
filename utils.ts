import { Request } from "express";
import { queueData } from "./types";

export const getQueryParamsArrayOrString = (req: Request, param: string, defaultValue: string | null = null) => {
	const queryParams = typeof req.query[param] === 'string' ? [String(req.query[param])] : req.query[param];
	let newParams;
		if (!queryParams || !Array.isArray(queryParams)) {
			newParams = defaultValue ? [defaultValue] : []
		} else {
			newParams = queryParams.map(prm => String(prm))
		}
	return newParams;
}

export const formatHours = (hours: number) => {
	const lastDigit = hours % 10;
	const lastTwoDigits = hours % 100;

	if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
		return `${hours} часов`;
	}

	switch (lastDigit) {
		case 1:
			return `${hours} час`;
		case 2:
		case 3:
		case 4:
			return `${hours} часа`;
		default:
			return `${hours} часов`;
	}
};

export const getISODate = (timeStamp: number) => {
	const date = new Date(timeStamp);
	const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
	return dateString;
};

export const getQueryParams = (req: Request) => {
	return {
		page: typeof req.query.page === 'string' ? parseInt(req.query.page) : -1,
		limit: typeof req.query.limit === 'string' ? parseInt(req.query.limit) : -1,
		filterFields: getQueryParamsArrayOrString(req, 'filterField'),
		filterValues: getQueryParamsArrayOrString(req, 'filterValue'),
		sortFields: getQueryParamsArrayOrString(req, 'sortField'),
		sorts: getQueryParamsArrayOrString(req, 'sort'),
		selectFields: getQueryParamsArrayOrString(req, 'selectFields'),
	}
}

export const formateRows = (rows: queueData[]) => {
	const formattedRows = rows.map(row => {
		const tempDate = new Date(Date.parse(row.queue_date));
		tempDate.setDate(tempDate.getDate() + 1);
		return {
		...row,
		queue_date: tempDate.toISOString().split("T")[0]
	}});

	return formattedRows;
};