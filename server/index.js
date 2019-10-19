import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import './database/database';
import entryRoute from './routes/entryRoutes';
import userRoute from './routes/userRoutes';


dotenv.config();

dotenv.config();
const PORT = process.env.PORT || 4000;
const app = express();
// middle wares

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/v2/entries', entryRoute);
app.use('/api/v2/auth', userRoute);

app.use('/', (req, res)=>{
	res.status(404).send({
		status: 404,
		error: 'Incorrect route',
	  });
});
app.listen(PORT, () => {
	console.log(`listening on port ${PORT} ...`);
});
module.exports = app;
