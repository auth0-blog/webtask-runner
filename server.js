// Use ES6 with Babel until Node has all features
require("babel/register");

import logger from 'morgan';
import cors from 'cors';
import http from 'http';
import express from 'express';
import errorhandler from 'errorhandler';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

let app = express();

dotenv.load();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use((err, req, res, next) => {
  if (err.name === 'StatusError') {
    res.send(err.status, err.message);
  } else {
    next(err);
  }
});

if (process.env.NODE_ENV === 'development') {
  app.use(express.logger('dev'));
  app.use(errorhandler())
}

app.get('/', (req, res) => {
  res.send("All ok").status(200);
})

let port = process.env.PORT || 3001;

http.createServer(app).listen(port, function (err) {
  console.log('listening in http://localhost:' + port);
});

exports default app;
