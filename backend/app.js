const express = require('express');
require('dotenv').config();
const app = express();
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
require('./auth.js');

const PORT = 3000;


app.use(cors({
	origin: 'http://localhost:8080',
	credentials: true
}));

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 1000 * 60 * 10 // 10 minutes
		}
	})
);

app.use(passport.initialize());
app.use(passport.session());

const authRouter = require('./routes/authRouter');
app.use('/auth', authRouter);

app.listen(PORT, (error) =>{ 
	if(!error) 
		console.log("Server is Successfully Running, and App is listening on port "+ PORT) 
	else
		console.log("Error occurred, server can't start", error); 
	} 
);