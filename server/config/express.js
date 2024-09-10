import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import cors from 'cors';
import express from 'express';
import expressValidation from 'express-validation';
import expressWinston from 'express-winston';
import helmet from 'helmet';
import httpStatus from 'http-status';
import methodOverride from 'method-override';
import path from 'path';

import winstonInstance from './winston.js';
import routes from '../../index.route.js';
import config from './config.js';
// import APIError from '../server/helpers/APIError';


const app = express();


if (config.env === 'development') {
  // app.use(logger('dev'));
}

// parse body params and attache them to req.body
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(cookieParser());
app.use(compress());
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());
app.disable('x-powered-by');

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// const staticPath = path.format({root: '/', dir: 'static'});

// mount all routes on /api path
app.use('/api', routes);
// app.use('/static', express.static(staticPath));


// if (config.enableAPIErrorHandler) {
//   // if error is not an instanceOf APIError, convert it.
//   routes.use((err, req, res, next) => {

//     if (err instanceof expressValidation.ValidationError) {
//       // validation error contains errors which is an array of error each containing message[]
//       const unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ');
//       const error = new APIError(unifiedErrorMessage, err.status, true);
//       return next(error);
//     } else if (!(err instanceof APIError)) {
//       let apiError;

//       if (typeof err === 'string') {
//         apiError = new APIError(err, httpStatus.NOT_FOUND, true);
//       } else {
//         apiError = new APIError(err.message, err.status, err.isPublic);
//       }

//       return next(apiError);
//     }

//     return next(err);
//   });

//   // catch 404 and forward to error handler
//   routes.use((req, res, next) => {
//     const err = new APIError('API not found', httpStatus.NOT_FOUND);
//     return next(err);
//   });

//   // error handler, send stacktrace only during development
//   routes.use((err, req, res, next) => // eslint-disable-line no-unused-vars
//     res.status(err.status).json({
//       message: err.isPublic ? err.message : httpStatus[err.status],
//       stack: config.env === 'development' ? err.stack : {}
//     })
//   );
// }

// log error in winston transports except when executing test suite
if (config.env !== 'test') {
  app.use(expressWinston.errorLogger({
    winstonInstance
  }));
}

export default app;
