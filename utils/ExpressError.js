class ExpressError extends Error {
    constructor(message, statusCode) {
        super(); //calls parent constructor
        this.message = message;
        this.statusCode = statusCode;
    }
}


module.exports = ExpressError;