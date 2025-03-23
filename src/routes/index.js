const ROUTES_V1 = require('./v1');

// type RouteConfig = {
//     path: string,
//     router: Router,
// };

module.exports = function (app) {
    ROUTES_V1().forEach(route => app.use(route.path, route.router));
}