import { NextFunction, Response } from "express";
import { RequestWithUser, Role } from "../types";

const authorizeRole = (roles: Role[]) => {
	return (req: RequestWithUser, res: Response, next: NextFunction) => {
		if (!(req.user && req.user.role && roles.includes(req.user.role))) {
			return res.status(403).json({ message: 'Access denied for this role' });
		}
		next();
	};
};

export default authorizeRole;