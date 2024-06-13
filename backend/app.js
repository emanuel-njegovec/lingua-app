const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const { createDBIfNotExists } = require('./db.js');
require('./auth.js');

const authRouter = require('./routes/authRouter');
const quizRouter = require('./routes/quizRouter');
const questionRouter = require('./routes/questionRouter');
const statsRouter = require('./routes/statsRouter');

const PORT = 3000;

createDBIfNotExists();

app.use(bodyParser.json());

app.use(cors({
	origin: process.env.FRONTEND_URL,
	credentials: true
}));

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 1000 * 60 * 60 // 60 minutes
		}
	})
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);
app.use('/quiz', quizRouter);
app.use('/question', questionRouter);
app.use('/stats', statsRouter);

app.listen(PORT, (error) =>{ 
	if(!error) 
		console.log("Server is Successfully Running, and App is listening on port "+ PORT) 
	else
		console.log("Error occurred, server can't start", error); 
	} 
);