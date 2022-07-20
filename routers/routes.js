const baseRouter = require('./base');
const authRouter = require('./auth');
const coachRouter = require('./coach');
const exerciceRouter = require('./exercice');
const trainingPlaneRouter = require('./trainingPlane');

const setupRoutes = (app) => {
  app.use(baseRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/coach', coachRouter);
  app.use('/api/exercice', exerciceRouter);
  app.use('/api/trainingPlane', trainingPlaneRouter);
};

module.exports = setupRoutes;
