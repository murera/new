import bcrypt from 'bcrypt';
import env from 'dotenv';
import jwt from 'jsonwebtoken';
import Database from '../database/database';
const SECRET_KEY = 'BAHATIROBBEN';

env.config();

const Helper = {

	hashThePassword(password) {
		const salt = bcrypt.genSaltSync(12);
		return bcrypt.hashSync(password, salt);
	},

	checkThepassword(hashPassword, password) {
		return bcrypt.compareSync(password, hashPassword);
	},
	// get token on login
	getToken({
		id, email, firstName, lastName
	}) {
		const token = jwt.sign({
			id, email, firstName, lastName
		}, SECRET_KEY);
		return token;
	},
	// a middleware
	async verifyToken(req, res, next) {
		const bearerHeader = req.headers.authorization;
		if (!bearerHeader) {
			return res.status(400).json({ status: 400, error: 'No token found' });
		}
		const token = bearerHeader.split(' ')[1];
		try {
			const { id, email } = await jwt.verify(token, SECRET_KEY);
			const getUser = `SELECT * FROM users WHERE id = $1`;
			const rows = await Database.execute(getUser, [id]);
			if (!rows[0]) {
				return res.status(401).json({status: 401, error: 'Invalid Token' });
			}
			// req.token = token;
		req.payload = { id, email };
		} catch (error) {
			return res.status(500).json(error);
		}
		next();
	}
};
export default Helper;
