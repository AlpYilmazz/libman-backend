const v1_users = require('./users/users.route');
const v1_books = require('./books/books.route');

// Note:
// normally PATH_V1 = '/v1';
// for the context of the case lets have it as empty
const PATH_V1 = '';
const ROUTES_V1 /** RouteConfig[] */ = [
    v1_users,
    v1_books,
];

module.exports = function () /** RouteConfig[] */ {
    return ROUTES_V1.map(route => ({
        path: PATH_V1 + route.path,
        router: route.router,
    }));
}