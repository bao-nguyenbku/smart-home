import homeRouter from './home.js';
import settingsRouter from './settings.js';
import statisticsRouter from './statistics.js';
const routes = app => {
    app.use('/', homeRouter);
    app.use('/settings', settingsRouter);
    app.use('/statistics', statisticsRouter);
}


export default routes;
