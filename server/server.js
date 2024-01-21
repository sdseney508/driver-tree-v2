const path = require('path');
const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const sequelize = require("./config/connection");
const app = express();



const PORT = process.env.PORT || 8080;
var corsOptions = {
  //for online use
  // origin: "https://drivertreev3-3350125317e2.herokuapp.com",
// 
  //for local use and AWS Testing
  origin: "http://localhost:3000"

};

app.disable("x-powered-by");
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//the below two are for deployed builds
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, '../client/build')));
}

// turn on routes
app.use(routes);

// turn on connection to db and server
sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));
});

