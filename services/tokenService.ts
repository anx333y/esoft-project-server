import TokenModel from "../models/tokenModel";

const jwt = require('jsonwebtoken');

class TokenService {
	tokenModel: TokenModel;

	constructor() {
		this.tokenModel = new TokenModel;
	}

	generateTokens(payload: {}) {
		const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'});
		const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'});
		return {
			accessToken,
			refreshToken
		}
	}

	validateAccessToken(token: string) {
		try {
			const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
			return userData;
		} catch (e) {
			return null;
		}
	}

	validateRefreshToken(token: string) {
		try {
			const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
			return userData;
		} catch (e) {
			return null;
		}
	}

	async saveToken(userId: string, refreshToken: string) {
		const tokenData = await this.tokenModel.getByField("user_id", userId);
		if (tokenData) {
			const updatedToken = await this.tokenModel.update(userId, {"refresh_token": refreshToken});
			return updatedToken;
		}
		const token = await this.tokenModel.create({user_id: userId, "refresh_token": refreshToken});
		return token;
	}

	async deleteToken(refreshToken: string) {
		const tokenData = await this.tokenModel.deleteByField("refresh_token", refreshToken);
		return tokenData;
	}

	async getToken(refreshToken: string) {
		const tokenData = await this.tokenModel.getByField("refresh_token", refreshToken);
		return tokenData;
	}
}

export default TokenService;