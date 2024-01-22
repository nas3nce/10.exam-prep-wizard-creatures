const { MongooseError } = require("mongoose");

exports.extractError = (error) => {
    const instanceOfMongooseError = error instanceof MongooseError;

    if (instanceOfMongooseError) {
        const errors = Object.values(error.errors);
        const msgs = errors.map(e => e.message);
        return msgs;
    }
    return [error.message];
};