import UserController from "../controllers/userController";
import express from "express";

export default (userController: UserController) => {
	const router = express.Router();

	router.route('/users')
		.get(userController.getAllUsers)
		.post(userController.createUser);
	router.route('/users/:userId')
		.get(userController.getUserById)
		.put(userController.updateUser)
		.delete(userController.deleteUser);

	return router;
};