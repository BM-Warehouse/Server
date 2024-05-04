const ClientError = require("@exceptions/clientError");
const errorType = require("@constants/errorType");

function notFound(req, res, next){
    console.log("inside not found");
    next(new ClientError(message = "Not Found", type = errorType.NOT_FOUND, statusCode = 404));
}

module.exports = notFound;