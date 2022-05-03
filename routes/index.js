import homeRouter from './home.js';

const routes = app => {
    app.use('/', homeRouter);
}

export default routes;
