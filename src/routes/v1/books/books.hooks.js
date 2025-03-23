const Joi = require('joi');
const { StatusCodes } = require('http-status-codes');

function validateBody_bookCreate(req, res, next) {
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

module.exports = {
    validateBody_bookCreate,
};