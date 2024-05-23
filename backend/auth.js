const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
require('dotenv').config();
const { pool } = require('./db');

passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (_, __, profile, done) => {
        const account = profile._json;
        let user = {};
        try {
          const currentUserQuery = await pool.query(
            "SELECT * FROM users WHERE google_id=$1",
            [account.sub]
          );
  
          if (currentUserQuery.rows.length === 0) {
            // create user
            await pool.query(
              "INSERT INTO users (username, google_id) VALUES ($1,$2)",
              [account.name, account.sub]
            );
  
            const data = await pool.query("SELECT id, user_role FROM users WHERE google_id=$1", [
              account.sub,
            ]);
            user = {
              id: data.rows[0].id,
              username: account.name,
              user_role: data.rows[0].user_role
            };
          } else {
            user = {
              id: currentUserQuery.rows[0].id,
              username: currentUserQuery.rows[0].username,
              user_role: currentUserQuery.rows[0].user_role
            };
          }
          done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );
  
  passport.serializeUser((user, done) => {
    // loads into req.session.passport.user
    done(null, user);
  });
  
  passport.deserializeUser((user, done) => {
    // loads into req.user
    done(null, user);
  });