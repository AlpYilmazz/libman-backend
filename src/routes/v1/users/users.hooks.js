const Joi = require('joi');
const { StatusCodes } = require('http-status-codes');

function validateBody_userCreate(req, res, next) {
    const object = req.body;

    const schema = Joi.object({
        name: Joi.string().required()
    }).unknown(false);

    const { error } = schema.validate(object);
    if (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: error });
        return;
    }
    next();
}

function validateBody_bookReturn(req, res, next) {
    const object = req.body;

    const schema = Joi.object({
        score: Joi.number().integer().min(0).max(10).required()
    }).unknown(false);

    const { error } = schema.validate(object);
    if (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: error });
        return;
    }
    next();
}

function validateParams_userIdAndBookIdIsNumeric(req, res, next) {
    const object = {
        userId: req.params.userId,
        bookId: req.params.bookId,
    };

    const schema = Joi.object({
        userId: Joi.number().integer().min(0).required(),
        bookId: Joi.number().integer().min(0).required(),
    }).unknown(false);

    const { error } = schema.validate(object);
    if (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: error });
        return;
    }
    next();
}

module.exports = {
    validateBody_userCreate,
    validateBody_bookReturn,
    validateParams_userIdAndBookIdIsNumeric,
};