require('dotenv').config()

import express from "express";
const cors = require('cors');
const cookieParser = require('cookie-parser');
const schedule = require('node-schedule');

import UserController from "./controllers/userController";
import UserModel from "./models/userModel";
import UserService from "./services/userService";
import userRoute from "./routes/userRoute";
import QueueController from "./controllers/queueController";
import queueRoute from "./routes/queueRoute";
import QueueModel from "./models/queueModel";
import QueueService from "./services/queueService";
import NewsModel from "./models/newsModel";
import NewsService from "./services/newsService";
import NewsController from "./controllers/newsController";
import newsRoute from "./routes/newsRoute";
import signRoute from "./routes/signRoute";
import authenticateJWT from "./middlewares/authenticateJWT";
import UserCalendarController from "./controllers/userCalendarController";
import UserCalendarModel from "./models/userCalendarModel";
import UserCalendarService from "./services/userCalendarService";
import userCalendarRoute from "./routes/userCalendarRoute";
import authorizeRole from "./middlewares/authorizeRole";
import authorizeIsActivated from "./middlewares/authorizeIsActivated";
import NewsCommentsModel from "./models/newsCommentsModel";
import NewsCommentsService from "./services/newsCommentsService";
import NewsCommentsController from "./controllers/newsCommentsController";
import newsCommentsRoute from "./routes/newsCommentsRoute";


const userModel = new UserModel;
const userService = new UserService(userModel);
const userController = new UserController(userService);

const queueModel = new QueueModel;
const queueService = new QueueService(queueModel);
const queueController = new QueueController(queueService);

const newsModel = new NewsModel;
const newsService = new NewsService(newsModel);
const newsController = new NewsController(newsService);

const newsCommentsModel = new NewsCommentsModel;
const newsCommentsService = new NewsCommentsService(newsCommentsModel);
const newsCommentsController = new NewsCommentsController(newsCommentsService);

const userCalendarModel = new UserCalendarModel;
const userCalendarService = new UserCalendarService(userCalendarModel);
const userCalendarController = new UserCalendarController(userCalendarService);

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
	credentials: true,
	origin: process.env.CLIENT_URL
}))

app.use('/api', signRoute(userController));
app.use('/api', newsCommentsRoute(newsCommentsController));
app.use('/api', authenticateJWT, authorizeIsActivated, queueRoute(queueController));
app.use('/api', authenticateJWT, authorizeIsActivated, newsRoute(newsController));
app.use('/api', authenticateJWT, authorizeIsActivated, userCalendarRoute(userCalendarController));
app.use('/api', authenticateJWT, authorizeRole(['admin']), authorizeIsActivated, userRoute(userController));

queueService.remindUserRecording();
const job = schedule.scheduleJob('* * * * *', queueService.remindUserRecording.bind(queueService));

const SERVER_PORT = Number(process.env.SERVER_PORT) || 3000;
const SERVER_HOST = process.env.SERVER_HOST || 'localhost';

app.listen(SERVER_PORT, SERVER_HOST, () => {
		console.log(`started on link: http://${SERVER_HOST}:${SERVER_PORT}`)
});