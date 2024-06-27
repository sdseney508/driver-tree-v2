const path = require('path');
const express = require("express");
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const cors = require("cors");
const routes = require("./routes");
const sequelize = require("./config/connection");
const app = express();
const router = require('express').Router();
const { audit } = require('./models');
require('dotenv').config({path: '../.env'});



const PORT = process.env.PORT || 8080;
var corsOptions = {
  //for online use
  origin: "https://drivertreev3-3350125317e2.herokuapp.com",

  //for local use and AWS Testing
  // origin: "http://localhost:3000"
// 
};

app.disable("x-powered-by");
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.set('trust proxy', true); // Trust the first proxy

//the below two are for deployed builds
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, '../client/build')));
}

// Configure Sequelize session store
const sessionStore = new SequelizeStore({
  db: sequelize,
});

app.use(session({
  secret: process.env.DB_SECRET, // This should be a random, secure key
  store: sessionStore,
  resave: false, // Do not save session if unmodified
  saveUninitialized: false, // Do not create session until something stored
  cookie: {
      secure: 'auto', // Secure cookie setting based on the request protocol
      maxAge: 2 * 60 * 60 * 1000 // 2 hours
  }
}));

// Sync the session store
sessionStore.sync();

// Middleware to log HTTP headers and request data
//STIG: v-222447
app.use(router);

// Your existing middleware setup
router.use(async (req, res, next) => {
  const { headers, method, url, body, session } = req;
  const userId = session.userId; // Assuming you store userId in session on login
  let xforward;
  if (headers['x-forwarded-for']) {
    xforward = headers['x-forwarded-for'];
  } else {
    xforward = req.ips.length > 0 ? req.ips[0] : req.ip;
  }
  const logData = {
      method,
      url,
      user_agent: headers['user-agent'],
      referer: headers['referer'] || headers['referrer'],
      x_forwarded_for: xforward,
      date: headers['date'],
      expires: headers['expires'],
      post_data: method === 'POST' ? JSON.stringify(body) : null,
      session_id: session.id, // Log the session ID
      user_id: userId, // Log the user associated with the session
  };

  try {
      await audit.create(logData);
      console.log('Session and request logged.');
  } catch (err) {
      console.error('Error saving log to database:', err);
  }

  next();
});

// turn on routes, this needs to be done AFTER the app.use(router) to ensure that the middleware is applied to the routes AFTER we log the HTTP headers
app.use(routes);

// Send for error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// turn on connection to db and server
sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));
});

