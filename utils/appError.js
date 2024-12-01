class createError extends Error {
    constructor(message , statusCode){
        super(message);

        this.statusCode = statusCode;
        this.statusCode =   `${statusCode}`.startsWith('4') ? "fail" : "error"
   Error.captureStackTrace(this, this.constructor)
   
   
    }
}

module.exports = createError;