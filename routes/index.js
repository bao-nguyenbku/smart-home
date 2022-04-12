import homeRouter from './home.js';
import settingsRouter from './settings.js';
import statisticsRouter from './statistics.js';
import loginRouter from './login.js';
import logoutRouter from './logout.js';

const routes = app => {
    app.use('/', homeRouter);
    app.use('/login', loginRouter);
    app.use('/logout', logoutRouter);
    app.use('/settings', settingsRouter);
    app.use('/statistics', statisticsRouter);
}


export default routes;
