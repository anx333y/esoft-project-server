import { NextFunction, Response } from "express";
import { RequestWithUser } from "../types";

const authorizeIsActivated = (req: RequestWithUser, res: Response, next: NextFunction) => {
	if (!req.user) {
		return res.status(404).json({ message: 'User not found' })
	}
	if (!req.user?.is_activated) {
		return res.status(403).json({ message: 'Account not activated' });
	}
	next();
};

export default authorizeIsActivated;