import morgan from 'morgan';
import bodyParser from 'body-parser';
import compression from 'compression';
import helmet from 'helmet';
import session from 'express-session';

import passport from 'passport';
import passportConfig from './passport';
import routes from '../routes';

const isProd = process.env.NODE_ENV === 'production';
passportConfig(passport);

export default (app) => {
  if (isProd) {
    app.use(compression());
    app.use(helmet());
  }

  app.use(morgan('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

	// use sessions
  app.use(
		session({
  secret: 'SessionSecret1',
  resave: false,
  saveUninitialized: true,
}),
	);
  app.use(passport.initialize());
  app.use(passport.session());

	// Middleware for handling routes and errors
  app.use('/', routes);
  app.use((reg, res, next) => {
    const err = new Error('Not found');
    err.status = 404;
    next(err);
  });
  app.use((err, reg, res, next) => {
    res.status(err.status || 500).json({
      error: {
        message: err.message,
      },
    });
    next(err);
  });
};