const errorType = require("@constants/errorType");
const ClientError = require("@src/exceptions/clientError");

function errorHandler(err, req, res, next) {
    if(err instanceof ClientError){
        res.status(err.statusCode).json(err.getObject());
    }
}

module.exports = errorHandler;