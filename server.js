import logger from 'morgan';
import cors from 'cors';
import http from 'http';
import express from 'express';
import errorhandler from 'errorhandler';
import bodyParser from 'body-parser';
import taskRunner from './task-runner';
import tokenCreator from './token-creator';

let app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(cors());

app.use((err, req, res, next) => {
  if (err.name === 'StatusError') {
    res.status(err.status).send({
      message: err.message,
      name: err.name,
      details: err.toString(),
      stack: err.stack
    });
  } else {
    next(err);
  }
});

app.get('/', (req, res) => {
  res.send("Server started").status(200);
});

if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
  app.use(errorhandler())
}

app.use(taskRunner);
app.use(tokenCreator);


let port = process.env.PORT || 3001;

http.createServer(app).listen(port, function (err) {
  console.log('listening in http://localhost:' + port);
});

export default app;
