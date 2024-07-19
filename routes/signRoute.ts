import UserController from "../controllers/userController";
import express, { NextFunction, Request, Response } from "express";

export default (userController: UserController) => {
	const router = express.Router();
	router.route('/register')
		.post(userController.createUser);
	router.route('/login')
		.post(userController.checkUser);
	router.route('/activate/:link')
		.get(userController.activateUser);
	router.route('/refresh')
		.get(userController.refreshToken);
	router.route('/logout')
		.post(userController.logout);

	return router;
};