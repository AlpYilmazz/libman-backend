const Joi = require('joi');
const { StatusCodes } = require('http-status-codes');

function createHook_parseNumericParams(params) {
    return (req, _res, next) => {
        for (const param of params) {
            req.params[param] = Number(req.params[param]);
        }
        next();
    };
}

function validateParams_IdIsInteger(req, res, next) {
    const object = {
        id: req.params.id,
    };

    const schema = Joi.object({
        id: Joi.number().integer().min(0).required()
    }).unknown(false);

    const { error } = schema.validate(object);
    if (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: error });
        return;
    }
    next();
}

module.exports = {
    createHook_parseNumericParams,
    validateParams_IdIsInteger,
};