import UserModel from "../models/userModel";
import { getAllQueryParams, userData } from "../types";
import mailService from "./mailService";
import TokenService from "./tokenService";

const bcrypt = require('bcrypt');
const uuid = require('uuid');

class UserService {
	userModel: UserModel;
	tokenService: TokenService;

	constructor(userModel: UserModel) {
		this.userModel = userModel;
		this.tokenService = new TokenService;
	}

	async getAllUsers(args: getAllQueryParams) {
		return this.userModel.getAll(args);
	};
	
	async createUser(userData: userData) {
		const hashedPassword = await bcrypt.hash(userData.password, Number(process.env.BCRYPT_SALT_ROUNDS));
		const activationLink = uuid.v4();

		const user = await this.userModel.create({...userData, password: hashedPassword, "activation_link": activationLink});
		await mailService.sendActivationMail(userData.email, `${process.env.API_URL}/api/activate/${activationLink}`);

		const tokenUserData = {
			"id": user[0].id,
			"full_name": user[0]["full_name"],
			"email": user[0]["email"],
			role: user[0].role,
			is_activated: user[0]["is_activated"]
		};
		
		const tokens = this.tokenService.generateTokens(tokenUserData);
		await this.tokenService.saveToken(tokenUserData.id, tokens.refreshToken);
		return {...tokens, user: tokenUserData}	
	};


	async getUserByField(fieldName: string, field: string) {
		return this.userModel.getByField(fieldName, field);
	};

	async updateUser(id: string, userData: Partial<userData>) {
		return this.userModel.update(id, userData);
	};

	async deleteUser(id: string) {
		return this.userModel.delete(id);
	};

	async checkUser(userData: userData) {
		const user: userData[] = await this.userModel.getByField("email", userData.email);
		if (!(user.length && await bcrypt.compare(userData.password, user[0].password))) {
			return;
		}
		const tokenUserData = {
			"id": user[0].id,
			"full_name": user[0]["full_name"],
			"email": user[0]["email"],
			role: user[0].role,
			is_activated: user[0]["is_activated"]
		};

		const tokens = this.tokenService.generateTokens(tokenUserData);
		await this.tokenService.saveToken(tokenUserData.id, tokens.refreshToken);
		return {...tokens, ...tokenUserData};
	};

	async activateUser(link: string) {
		const user: userData[] = await this.userModel.getByField("activation_link", link);
		if (!user) {
				throw new Error("Incorrect activation link");
		}
		await this.updateUser(user[0].id, {"is_activated": true});
	};

	async refreshToken(token: string) {
		if (!token) {
				throw new Error('No token')
		}
		const userData = this.tokenService.validateRefreshToken(token);
		const tokenFromDb = await this.tokenService.getToken(token);
		if (!userData || !tokenFromDb) {
				throw new Error('Failed to validate token')
		}
		const user = await this.userModel.getByField("id", userData.id);
		const tokenUserData = {
			"id": user[0].id,
			"full_name": user[0]["full_name"],
			"email": user[0]["email"],
			role: user[0].role,
			is_activated: user[0]["is_activated"]
		};

		const tokens = this.tokenService.generateTokens(tokenUserData);

		await this.tokenService.saveToken(tokenUserData.id, tokens.refreshToken);
		return {...tokens, ...tokenUserData}
	};

	async logout(refreshToken: string) {
		const token = await this.tokenService.deleteToken(refreshToken);
		return token;
	}

};

export default UserService;