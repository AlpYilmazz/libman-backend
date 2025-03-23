const express = require('express');
const { StatusCodes } = require('http-status-codes');
const { DB } = require('../../../db');
const { createHook_parseNumericParams, validateParams_IdIsInteger } = require('../../../hooks');
const { validateBody_userCreate, validateParams_userIdAndBookIdIsNumeric, validateBody_bookReturn } = require('./users.hooks');

const router = express.Router();

/**
 * GET /users
 * List all users
 */
router.get(
    '/',
    [],
    async function(_req, res, _next) {
        const users = await DB.users().select('id', 'name');
        res.status(StatusCodes.OK).json(users);
    }
);

/**
 * GET /users/:id
 * Get user with ':id'
 */
router.get(
    '/:id',
    [
        validateParams_IdIsInteger,
        createHook_parseNumericParams(['id']),
    ],
    async function(req, res, _next) {
        const { id } = req.params;

        const user = await DB.users()
            .select('id', 'name')
            .where({ id })
            .first();

        if (!user) {
            res.status(StatusCodes.NOT_FOUND).json({ msg: `User with given id [${id}] is not found.` });
            return;
        }

        const history = await DB.history()
            .join('books', 'history.book_id', 'books.id')
            .select('books.name', 'history.active', 'history.score')
            .where({ user_id: id });

        user.books = {
            past: history.filter(h => !h.active).map(h => ({ name: h.name, userScore: h.score })),
            present: history.filter(h => h.active).map(h => ({ name: h.name })),
        };

        res.status(StatusCodes.OK).json(user);
    }
);

/**
 * POST /users
 * Create user
 */
router.post(
    '/',
    [
        validateBody_userCreate
    ],
    async function(req, res, _next) {
        const user = req.body;

        const userInit = {
            name: user.name,
        };

        const ids = await DB.users().insert(userInit, ['id']);
        const id = ids[0];

        res.status(StatusCodes.CREATED).json(id);
    }
);

/**
 * POST /users/:userId/borrow/:bookId
 * Borrow book
 */
router.post(
    '/:userId/borrow/:bookId',
    [
        validateParams_userIdAndBookIdIsNumeric,
        createHook_parseNumericParams(['userId', 'bookId']),
    ],
    async function(req, res, _next) {
        const { userId, bookId } = req.params;

        const user = await DB.users()
            .select('id')
            .where({ id: userId })
            .first();
        if (!user) {
            res.status(StatusCodes.NOT_FOUND).json({ msg: `User with given id [${userId}] is not found.` });
            return;
        }

        const book = await DB.books()
            .select('id')
            .where({ id: bookId })
            .first();
        if (!book) {
            res.status(StatusCodes.NOT_FOUND).json({ msg: `Book with given id [${bookId}] is not found.` });
            return;
        }

        const updatedIds = await DB.books()
            .where({ id: bookId, borrowed_by: null })
            .update({ borrowed_by: userId }, ['id']);
        if (updatedIds.length === 0) {
            res.status(StatusCodes.BAD_REQUEST).json({ msg: `Book with given id [${bookId}] is already borrowed by a user.` });
            return;
        }

        const historyInit = {
            user_id: userId,
            book_id: bookId,
            active: true,
            borrow_time: Date.now(),
        };
        await DB.history().insert(historyInit);

        res.status(StatusCodes.CREATED).json({ msg: 'OK' });
    }
);

/**
 * POST /users/:userId/borrow/:bookId
 * Return borrowed book
 */
router.post(
    '/:userId/return/:bookId',
    [
        validateParams_userIdAndBookIdIsNumeric,
        validateBody_bookReturn,
        createHook_parseNumericParams(['userId', 'bookId']),
    ],
    async function(req, res, _next) {
        const { userId, bookId } = req.params;
        const { score } = req.body;

        const user = await DB.users()
            .select('id')
            .where({ id: userId })
            .first();
        if (!user) {
            res.status(StatusCodes.NOT_FOUND).json({ msg: `User with given id [${userId}] is not found.` });
            return;
        }

        const book = await DB.books()
            .select('id', 'avg_score', 'times_scored')
            .where({ id: bookId })
            .first();
        if (!book) {
            res.status(StatusCodes.NOT_FOUND).json({ msg: `Book with given id [${bookId}] is not found.` });
            return;
        }

        /**
         * Note:
         * Average score is recalculated at book return using weighted average
         * and the value is readily stored rather than calculated at view time
         * since it was mentioned that book viewing is a more frequent process than borrow-return
         */
        const avgScore = Number(book.avg_score), timesScored = Number(book.times_scored);
        const newAvgScore = ((avgScore * timesScored) + score) / (timesScored + 1);

        const updatedIds = await DB.books()
            .where({ id: bookId, borrowed_by: userId })
            .update({ avg_score: newAvgScore, times_scored: timesScored + 1, borrowed_by: null }, ['id']);

        /**
         * Note:
         * 'updatedIds.length === 0' means
         * no updates were made which means the book was not borrowed by the user
         * The book could have been borrowed by someone else or noneone
         */
        if (updatedIds.length === 0) {
            res.status(StatusCodes.BAD_REQUEST).json({ msg: `Book with given id [${bookId}] is not borrowed by the user with given id [${userId}].` });
            return;
        }

        await DB.history()
            .where({ user_id: userId, book_id: bookId, active: true })
            .orderBy('borrow_time', 'desc')
            .first()
            .update({ score, active: false, return_time: Date.now() });

        res.status(StatusCodes.CREATED).json({ msg: 'OK' });
    }
);

module.exports = {
    path: '/users',
    router,
};
