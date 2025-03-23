const express = require('express');
const { StatusCodes } = require('http-status-codes');
const { DB } = require('../../../db');
const { validateParams_IdIsInteger, createHook_parseNumericParams } = require('../../../hooks');
const { validateBody_bookCreate } = require('./books.hooks');

const router = express.Router();

/**
 * GET /books
 * List all books
 */
router.get(
    '/',
    [],
    async function(_req, res, _next) {
        const books = await DB.books().select('id', 'name');
        res.status(StatusCodes.OK).json(books);
    }
);

/**
 * GET /books/:id
 * Get book with ':id'
 */
router.get(
    '/:id',
    [
        validateParams_IdIsInteger,
        createHook_parseNumericParams(['id']),
    ],
    async function(req, res, _next) {
        const { id } = req.params;

        const book = await DB.books()
            .select('id', 'name', 'avg_score', 'times_scored')
            .where({ id })
            .first();

        if (!book) {
            res.status(StatusCodes.NOT_FOUND).json({ msg: `Book with given id [${id}] is not found.` });
            return;
        }

        const bookRes = {
            id: book.id,
            name: book.name,
            score: book.times_scored === 0 ? -1 : book.avg_score, // book.avg_score is string
        };
        
        res.status(StatusCodes.OK).json(bookRes);
    }
);

/**
 * POST /books
 * Create book
 */
router.post(
    '/',
    [
        validateBody_bookCreate
    ],
    async function(req, res, _next) {
        const book = req.body;

        const bookInit = {
            name: book.name,
            avg_score: -1,
            times_scored: 0,
        };

        const ids = await DB.books().insert(bookInit, ['id']);
        const id = ids[0];

        res.status(StatusCodes.CREATED).json(id);
    }
);

module.exports = {
    path: '/books',
    router,
};
