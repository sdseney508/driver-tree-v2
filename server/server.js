const path = require('path');
const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const sequelize = require("./config/connection");
const app = express();
// const fs = require('fs');
// const PDFDocument = require('pdfkit');


const PORT = process.env.PORT || 8080;
var corsOptions = {
  //for online use
  origin: "https://drivertreev3-3350125317e2.herokuapp.com",
// https://drivertreev3-3350125317e2.herokuapp.com
//https://driver-tree-830b009d7ab7.herokuapp.com/
  //for local use try again
  // origin: "http://localhost:3000"
// 
};
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// app.post('/generate-pdf', (req, res) => {
//   //whats going in the pdf
//   console.log(req.body.elementsForPDF);
//   const elementsForPDF = req.body.elementsForPDF;

//   //create the pdf on the server
//   const doc = new PDFDocument();
//   doc.pipe(fs.createWriteStream('output.pdf'));

//   //append the content to the PDF
//   elementsForPDF.forEach(element => {
//     //first attempt, if we make each Driver Card and the Driver Tree
//     //into SVG or Canvas images, then this probably works
//     //and we'll just keep using the doc.AddPage() method
//     doc.addPage().text(element, 100, 100);
//   });

//   //close out the PDF
//   doc.end();

//   //need to compare this with the example on the documentation of
//   //res.sendFile('output.pdf', { root: __dirname })
//   res.sendFile(path.resolve(__dirname, 'output.pdf'));

// });
// simple route

//the below two are for deployed builds
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, '../client/build')));
}

// turn on routes
app.use(routes);

// turn on connection to db and server
//{ force: false } to drop tables and recreate
sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));
});

