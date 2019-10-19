/* eslint-disable guard-for-in */
/* eslint-disable prefer-const */
/* eslint-disable quotes */
import Database from '../database/database';


class EntryModel {
	async create(req) {
		const userId = req.payload.id;
		console.log(userId);
		const {
			title,  description
		} = req.body;
		const prop = `SELECT * FROM entries WHERE title = $1 and ownerid = $2`;
		const property = await Database.execute(prop, [title,userId]);
		if (property[0]) {
			return { status: 409, data:{error: 'entry already exist'}  };
		}
		const createAd = `INSERT INTO entries (title, description, ownerId) VALUES ($1, $2, $3) RETURNING *`;
		try {
			const rows = await Database.execute(createAd,
				[title,  description, userId]);
			
			return { status: 201, message:"entry successfully created" ,data: rows[0] };
		} catch (error) {
			return { status: 500, data: { error: 'something went wrong' } };
		}
	}

	async findOne(req,id) {
		const userId = req.payload.id;
		// eslint-disable-next-line eqeqeq
		const getProperty = `SELECT * FROM entries WHERE id = $1`;
		const rows = await Database.execute(getProperty, [id]);
		console.log(rows[0]);
		console.log(req.payload.id);
		// breakpoint
		if (!rows[0]) {
			return { status: 404, data: { error: 'entry Not found' } };
		}
		
		if (rows[0].ownerid != userId) {
			return { status: 403, data: { error: 'forbidden' } };
		}
		return { status: 200, data: rows[0] };
	}

	async findAll(req) {
		try {
			const getProperty = `SELECT * FROM entries WHERE ownerId = $1`;
			const rows = await Database.execute(getProperty, [req.payload.id]);
			console.log(rows[0]);
			if(!rows[0]){
				return { status: 404, data: { error: 'you do not have any entries now' } };	
			}
			return { status: 200, data: rows };
		} catch (error) {
			return { status: 500, data: { error: `${error}` } };
		}
	}

	async delete(req) {
		const ownerId = req.payload.id;
		const { id } = req.params;
		
		// find if the property exist
		const prop = await this.findOne(req,id);
		console.log(prop);
		if (prop.status !== 200) {
			return { status: prop.status, data: prop.data };
		}
		try {
			const query = `DELETE FROM entries WHERE id = $1`;
			await Database.execute(query, [id]);
			const check = `SELECT * FROM entries WHERE id = $1`;
			const prop = await Database.execute(check, [id]);
			if (prop.length === 0) {
				return { status: 200, data: { message: 'entry deleted successfully' } };
			}
			return { status: 500, data: { error: 'something went wrong' } };
			
		} catch (error) {
			return { status: 500, data: { error } };
		}
	}

	async update(req) {
		// const { email } = req.payload;
		const ownerId = req.payload.id;
		const { id } = req.params;
		// find if the property exist
		const prop = await this.findOne(req,id);
		if (prop.status !== 200) {
			return { status: prop.status, data: prop.data };
		}
		
		const getCurrent = `SELECT * FROM entries WHERE id = $1`; 
		const update = `UPDATE entries SET title = $1, description = $2 WHERE id = $3 RETURNING *`;

		const current = await Database.execute(getCurrent, [id]);
		const { title,description } = current[0];
		const t = req.body.title || title;

		const d = req.body.description || description;

		const updated = await Database.execute(update, [t, d, id]);

		return { status: 200, message:"entry successfully edited", data: updated[0] };
	}

	
}

export default new EntryModel();
